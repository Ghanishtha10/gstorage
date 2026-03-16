
import { handleUpload, type HandleUploadBody } from '@vercel/blob/nextjs';
import { NextResponse } from 'next/server';

/**
 * Server-side endpoint to generate client-side upload tokens for Vercel Blob.
 * This allows the browser to upload large files directly to storage, 
 * bypassing the 4.5MB Next.js body size limit.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // In a production app, you would verify the user's session here.
        // For this prototype, we allow all authenticated-style requests.
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
            // Optional: information you want to receive back in onUploadCompleted
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // This is called by Vercel after the file is successfully uploaded.
        // We handle the Firestore metadata storage on the client side for this prototype,
        // but you could also perform server-side database updates here.
        console.log('Blob upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // The client-side SDK looks for a non-200 response to handle errors
    );
  }
}
