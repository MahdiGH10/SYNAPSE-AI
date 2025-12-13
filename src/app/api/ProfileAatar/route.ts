import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db';
import { Avatar } from '@/models/Avatar';

// Configure Cloudinary - ensure these env vars are set where Next.js runs
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    // Only accept multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { success: false, message: 'Content-Type must be multipart/form-data' },
        { status: 400 }
      );
    }

    await connectDB();

    const form = await request.formData();

    // Get userId
    const userIdField = form.get('userId');
    const userId = typeof userIdField === 'string' ? userIdField.trim() : undefined;
    if (!userId) {
      return NextResponse.json({ success: false, message: 'Missing form field: userId' }, { status: 400 });
    }

    // Get file
    const file = form.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ success: false, message: 'Missing form field: file' }, { status: 400 });
    }

    // Basic validation (optional - adjust limits/types as needed)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Unsupported file type: ${file.type}` },
        { status: 400 }
      );
    }
    const MAX_BYTES = 100 * 1024 * 1024; // 100MB
    const arrayBuffer = await file.arrayBuffer();
    if (arrayBuffer.byteLength > MAX_BYTES) {
      return NextResponse.json(
        { success: false, message: `File too large. Max ${MAX_BYTES} bytes allowed.` },
        { status: 400 }
      );
    }

    // Convert file to data URI (Cloudinary accepts data URIs)
    const buffer = Buffer.from(arrayBuffer);
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary with stable public_id so subsequent uploads overwrite
    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: 'avatars',
      public_id: `avatar_${userId}`,
      overwrite: true,
      resource_type: 'image',
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });

    const finalImageUrl = uploadResult.secure_url;

    // Find existing avatar and update or create new
    let avatar = await Avatar.findOne({ userId });
    if (avatar) {
      avatar.imageUrl = finalImageUrl;
      await avatar.save();
    } else {
      avatar = await Avatar.create({
        userId,
        imageUrl: finalImageUrl,
      });
    }

    return NextResponse.json(
      { success: true, message: 'Avatar saved successfully', data: avatar },
      { status: 200 }
    );
  } catch (error) {
    console.error('Avatar save error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save avatar', error: String(error) },
      { status: 500 }
    );
  }
}