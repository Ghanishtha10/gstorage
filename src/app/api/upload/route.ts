
import { handleUpload, type HandleUploadBody } from '@vercel/blob/nextjs';
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
        // Verification logic for session or user could go here
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
            // Optional data can be passed here
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Metadata storage is primarily handled on client in this prototype
        console.log('Blob upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
