
import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing storage token.' },
        { status: 500 }
      );
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Delete the file from Vercel Blob
    await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete API error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'An unexpected error occurred during deletion.' },
      { status: 500 }
    );
  }
}
