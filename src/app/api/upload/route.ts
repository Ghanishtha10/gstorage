import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

/**
 * Server-side upload endpoint.
 * Receives a file via FormData and uploads it to Vercel Blob using the server-side secret token.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
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

    // Upload directly from the server to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Server-side upload error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to process file upload' },
      { status: 500 }
    );
  }
}
