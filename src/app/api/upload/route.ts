
import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

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
    const blob = await put(file.name, file, {
      access: 'public',
      contentType: file.type,
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'An unexpected error occurred during upload.' },
      { status: 500 }
    );
  }
}
