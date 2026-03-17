import { handleUpload, type HandleUploadBody } from '@vercel/blob';
import { NextResponse } from 'next/server';

/**
 * Server-side endpoint to generate client-side upload tokens for Vercel Blob.
 * This allows the browser to upload large files directly to storage, 
 * bypassing the 4.5MB Next.js body size limit.
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Authorization logic: you could verify the user session here if needed
        return {
          allowedContentTypes: [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'video/mp4', 
            'audio/mpeg', 
            'audio/mp3',
            'audio/wav',
            'application/pdf',
            'text/plain',
            'application/zip'
          ],
          tokenPayload: JSON.stringify({
            // Optional metadata passed to onUploadCompleted
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This runs server-side after the client finishes the upload
        console.log('Blob upload completed successfully:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to generate upload token' },
      { status: 400 }
    );
  }
}
