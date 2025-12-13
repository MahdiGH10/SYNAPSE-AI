import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { verifyToken } from '@/lib/jwt';

// Simple document classification without external service
function classifyDocument(text: string, filename: string): { category: string; confidence: number } {
  const lowerText = text.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  // Define keyword patterns for different categories
  const categories = [
    {
      name: 'Math',
      keywords: ['equation', 'theorem', 'proof', 'mathematics', 'algebra', 'calculus', 'geometry', 'trigonometry', 'integral', 'derivative'],
      weight: 0
    },
    {
      name: 'Science',
      keywords: ['experiment', 'hypothesis', 'research', 'biology', 'chemistry', 'physics', 'molecule', 'atom', 'cell', 'energy'],
      weight: 0
    },
    {
      name: 'Computer Science',
      keywords: ['algorithm', 'programming', 'code', 'software', 'computer', 'data structure', 'function', 'variable', 'class', 'database'],
      weight: 0
    },
    {
      name: 'History',
      keywords: ['century', 'war', 'ancient', 'civilization', 'empire', 'revolution', 'historical', 'era', 'dynasty', 'colonial'],
      weight: 0
    },
    {
      name: 'Literature',
      keywords: ['novel', 'poem', 'author', 'character', 'story', 'narrative', 'literature', 'writing', 'fiction', 'poetry'],
      weight: 0
    },
    {
      name: 'Business',
      keywords: ['market', 'revenue', 'profit', 'company', 'business', 'finance', 'investment', 'strategy', 'customer', 'sales'],
      weight: 0
    },
  ];
  
  // Count keyword matches
  categories.forEach(category => {
    category.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = (lowerText.match(regex) || []).length;
      const filenameMatch = lowerFilename.includes(keyword) ? 5 : 0;
      category.weight += matches + filenameMatch;
    });
  });
  
  // Find best match
  const sorted = categories.sort((a, b) => b.weight - a.weight);
  const bestMatch = sorted[0];
  const totalWeight = categories.reduce((sum, cat) => sum + cat.weight, 0);
  
  // Calculate confidence (0-1 scale)
  const confidence = totalWeight > 0 
    ? Math.min(bestMatch.weight / totalWeight, 0.95) 
    : 0.5;
  
  return {
    category: bestMatch.weight > 0 ? bestMatch.name : 'General',
    confidence: confidence
  };
}

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
      userId: (decoded as any).userId,
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
    else if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
      // CSV Processing
      try {
        const csvText = buffer.toString('utf-8');
        const lines = csvText.trim().split('\n');
        const rows = lines.map(line => line.split(',').map(cell => cell.trim()));
        
        // Create formatted text representation
        const headers = rows[0] || [];
        const dataRows = rows.slice(1);
        
        extractedText = `CSV Data File: ${fileName}\n\n`;
        extractedText += `Headers: ${headers.join(', ')}\n\n`;
        extractedText += `Data (${dataRows.length} rows):\n`;
        
        // Include first 50 rows in the text for context
        const previewRows = dataRows.slice(0, 50);
        previewRows.forEach((row, idx) => {
          extractedText += `Row ${idx + 1}: ${row.join(', ')}\n`;
        });
        
        if (dataRows.length > 50) {
          extractedText += `\n... and ${dataRows.length - 50} more rows\n`;
        }
        
        // Add summary statistics
        extractedText += `\n\nSummary:\n`;
        extractedText += `- Total Rows: ${dataRows.length}\n`;
        extractedText += `- Columns: ${headers.length}\n`;
        extractedText += `- Column Names: ${headers.join(', ')}\n`;
        
        metadata.format = 'csv';
        metadata.rows = dataRows.length;
        metadata.columns = headers.length;
        metadata.headers = headers;
        console.log(`✅ CSV processed: ${dataRows.length} rows, ${headers.length} columns`);
      } catch (error: any) {
        console.error('CSV parsing error:', error);
        return NextResponse.json({ 
          error: 'Failed to parse CSV file',
          details: error.message 
        }, { status: 500 });
      }
    }
    else if (fileType.startsWith('image/')) {
      // Image processing - placeholder for OCR
      // Note: tesseract.js is large and slow. For production, consider server-side OCR
      extractedText = `Image uploaded: ${fileName}\n\nNote: OCR text extraction from images is in development. Please upload text-based documents (PDF, DOCX, TXT, CSV) for full analysis.`;
      metadata.format = 'image';
      metadata.note = 'OCR not yet implemented';
      console.log(`⚠️ Image uploaded (OCR pending): ${fileName}`);
    }
    else {
      return NextResponse.json({ 
        error: 'Unsupported file type',
        message: 'Please upload PDF, DOCX, TXT, CSV files. PPTX and images have limited support.',
        supportedFormats: ['PDF', 'DOCX', 'TXT', 'CSV', 'PPTX (limited)', 'Images (limited)']
      }, { status: 400 });
    }

    // Validate extracted text (more lenient for PPTX and images)
    const isLimitedFormat = fileName.endsWith('.pptx') || fileType.startsWith('image/');
    const minLength = isLimitedFormat ? 5 : 10;
    
    if (!extractedText || extractedText.trim().length < minLength) {
      console.error(`❌ Text extraction failed: only ${extractedText?.length || 0} characters extracted`);
      return NextResponse.json({ 
        error: 'No text could be extracted from the file',
        message: fileType === 'application/pdf' 
          ? 'The PDF may be scanned/image-based. Try uploading a text-based PDF or convert images to text first.'
          : fileType.includes('word')
          ? 'The DOCX file appears empty or corrupted. Please check the file and try again.'
          : fileName.endsWith('.pptx')
          ? 'PPTX text extraction is limited. For better results, export your presentation to PDF.'
          : fileType.startsWith('image/')
          ? 'OCR is not yet available. Please convert images to PDF with text or upload text-based documents.'
          : 'The file may be empty, corrupted, or in an unsupported format.',
        fileType: fileType,
        fileName: fileName
      }, { status: 400 });
    }

    // Calculate statistics
    const wordCount = extractedText.split(/\s+/).filter(w => w.length > 0).length;
    const characterCount = extractedText.length;
    
    // Simple classification based on keywords (no external service needed)
    const classification = classifyDocument(extractedText, fileName);

    console.log(`✅ Document processed successfully: ${fileName}`);
    console.log(`   - Words: ${wordCount}`);
    console.log(`   - Characters: ${characterCount}`);
    console.log(`   - Category: ${classification.category}`);

    // Return extracted text directly (no RAG service needed)
    return NextResponse.json({
      success: true,
      message: 'Document processed successfully',
      data: {
        filename: fileName,
        type: fileType,
        text: extractedText, // Full text for chat context
        extractedLength: characterCount,
        wordCount: wordCount,
        pages: metadata.pages,
        metadata: metadata,
        classification: classification,
        uploadedAt: new Date().toISOString(),
      },
    });

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
