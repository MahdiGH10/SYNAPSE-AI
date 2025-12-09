import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { verifyToken } from '@/lib/jwt';

const RAG_SERVICE_URL = process.env.RAG_SERVICE_URL || 'http://localhost:5001';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileType = file.type;
    const fileName = file.name;
    const buffer = Buffer.from(await file.arrayBuffer());

    let extractedText = '';
    let metadata: any = {
      originalName: fileName,
      fileType: fileType,
      uploadedAt: new Date().toISOString(),
      userId: decoded.userId,
    };

    console.log(`Processing file: ${fileName} (${fileType})`);

    // Process based on file type
    if (fileType === 'application/pdf') {
      // PDF Processing
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = pdfData.text;
        metadata.pages = pdfData.numpages;
        metadata.info = pdfData.info;
        console.log(`✅ PDF processed: ${pdfData.numpages} pages, ${extractedText.length} characters`);
      } catch (error: any) {
        console.error('PDF parsing error:', error);
        return NextResponse.json({ 
          error: 'Failed to parse PDF file',
          details: error.message 
        }, { status: 500 });
      }
    } 
    else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      // DOCX Processing
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value;
        metadata.format = 'docx';
        console.log(`✅ DOCX processed: ${extractedText.length} characters`);
      } catch (error: any) {
        console.error('DOCX parsing error:', error);
        return NextResponse.json({ 
          error: 'Failed to parse DOCX file',
          details: error.message 
        }, { status: 500 });
      }
    }
    else if (fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' || fileName.endsWith('.pptx')) {
      // PPTX Processing - Basic text extraction
      // Note: For full PPTX support, consider using 'pptx2json' or 'pptxtract' libraries
      extractedText = `PowerPoint presentation: ${fileName}\n\nNote: Full PPTX text extraction is in development. Please upload as PDF for complete analysis.`;
      metadata.format = 'pptx';
      metadata.note = 'Limited text extraction';
      console.log(`⚠️ PPTX uploaded (limited extraction): ${fileName}`);
    }
    else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      // Plain text
      extractedText = buffer.toString('utf-8');
      metadata.format = 'text';
      console.log(`✅ TXT processed: ${extractedText.length} characters`);
    }
    else if (fileType.startsWith('image/')) {
      // Image processing - placeholder for OCR
      // Note: tesseract.js is large and slow. For production, consider server-side OCR
      extractedText = `Image uploaded: ${fileName}\n\nNote: OCR text extraction from images is in development. Please upload text-based documents (PDF, DOCX, TXT) for full analysis.`;
      metadata.format = 'image';
      metadata.note = 'OCR not yet implemented';
      console.log(`⚠️ Image uploaded (OCR pending): ${fileName}`);
    }
    else {
      return NextResponse.json({ 
        error: 'Unsupported file type',
        message: 'Please upload PDF, DOCX, TXT files. PPTX and images have limited support.',
        supportedFormats: ['PDF', 'DOCX', 'TXT', 'PPTX (limited)', 'Images (limited)']
      }, { status: 400 });
    }

    // Validate extracted text
    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json({ 
        error: 'No text could be extracted from the file',
        message: 'The file may be empty, corrupted, or in an unsupported format.'
      }, { status: 400 });
    }

    // Store in RAG system
    try {
      console.log(`Sending to RAG service: ${RAG_SERVICE_URL}/upload-document`);
      
      // Create form data for RAG service
      const ragFormData = new FormData();
      const textBlob = new Blob([extractedText], { type: 'text/plain' });
      const textFile = new File([textBlob], fileName, { type: 'text/plain' });
      ragFormData.append('file', textFile);

      const ragResponse = await fetch(`${RAG_SERVICE_URL}/upload-document`, {
        method: 'POST',
        body: ragFormData,
      });

      const ragData = await ragResponse.json();

      if (!ragResponse.ok) {
        throw new Error(ragData.error || 'RAG service error');
      }

      console.log(`✅ Document stored in RAG system:`, ragData);

      return NextResponse.json({
        success: true,
        message: 'Document processed and uploaded successfully',
        data: {
          filename: fileName,
          type: fileType,
          extractedLength: extractedText.length,
          metadata: metadata,
          classification: ragData.classification || { category: 'Unknown', confidence: 0 },
          ragStatus: 'stored',
        },
      });

    } catch (ragError: any) {
      console.error('RAG service error:', ragError);
      return NextResponse.json({ 
        error: 'Failed to store document in RAG system',
        details: ragError.message,
        extractedText: extractedText.substring(0, 500) + '...', // Preview
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Document upload error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to process document',
      details: error.stack
    }, { status: 500 });
  }
}

// GET method to list supported formats
export async function GET() {
  return NextResponse.json({
    success: true,
    supportedFormats: {
      fullySupported: ['PDF', 'DOCX', 'TXT'],
      limitedSupport: ['PPTX', 'Images (JPG, PNG)'],
      upcoming: ['Excel (XLSX)', 'Full PPTX extraction', 'OCR for images']
    },
    notes: {
      pdf: 'Full text extraction with metadata',
      docx: 'Full text extraction',
      txt: 'Direct text reading',
      pptx: 'Limited text extraction (convert to PDF for best results)',
      images: 'OCR coming soon (upload as PDF for now)'
    }
  });
}
