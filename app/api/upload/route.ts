import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { imageBase64 } = await request.json();
    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Convert base64 data URL to Buffer
    const base64Data = imageBase64.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Upload to Vercel Blob
    const blob = await put(`hhgoa2026-${Date.now()}.png`, buffer, {
      access: 'public',
      contentType: 'image/png',
    });

    // Instead of needing a database, we can just encode the blob URL into base64 
    // to act as the "id" for our share page route
    const id = Buffer.from(blob.url).toString('base64url');

    return NextResponse.json({ id });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
