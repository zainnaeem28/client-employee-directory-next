import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side image upload API route
 * Handles image uploads to ImgBB while keeping the API key secure on the server
 */

const IMGBB_API_KEY = process.env.IMGBB_API_KEY || process.env.NEXT_PUBLIC_IMGBB_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!IMGBB_API_KEY) {
      return NextResponse.json(
        { error: 'Image upload service not configured' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!image.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (image.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to base64 for ImgBB API
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Upload to ImgBB using the correct format
    const imgbbFormData = new URLSearchParams();
    imgbbFormData.append('image', base64Image);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: imgbbFormData.toString(),
    });

    if (!response.ok) {
      throw new Error(`ImgBB API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        url: data.data.url,
        delete_url: data.data.delete_url,
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 