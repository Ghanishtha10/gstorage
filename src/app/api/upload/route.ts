import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

/**
 * Server-side upload endpoint.
 * Receives a file via FormData and uploads it to Vercel Blob using the server-side secret token.
 * Guaranteed to return JSON responses.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Upload API: Missing BLOB_READ_WRITE_TOKEN');
      return NextResponse.json(
        { error: 'Server configuration error: Missing storage token.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided in request.' }, { status: 400 });
    }

    console.log(`Upload API: Processing file ${file.name} (${file.size} bytes)`);

    // Upload directly from the server to Vercel Blob
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload API: Critical failure:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred during the upload process.';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
