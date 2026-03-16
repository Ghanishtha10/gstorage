
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const maxDuration = 60; // Increase timeout for larger files

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Check if the token exists to provide a better error message
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Missing BLOB_READ_WRITE_TOKEN environment variable');
      return NextResponse.json(
        { error: 'Server configuration error: Missing storage token.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Upload the file to Vercel Blob
    // 'public' access is required for the file to be accessible via URL
    const blob = await put(file.name, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload API error:', error);
    
    // Check for specific payload size errors which might manifest as various error types
    const errorMessage = (error as Error).message || '';
    if (errorMessage.includes('body size') || errorMessage.includes('large')) {
       return NextResponse.json(
        { error: 'The file is too large to be processed by this server route. Please use a file smaller than 4.5MB.' },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { error: (error as Error).message || 'An unexpected error occurred during upload.' },
      { status: 500 }
    );
  }
}
