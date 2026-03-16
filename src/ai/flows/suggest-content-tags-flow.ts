
'use server';
/**
 * @fileOverview This file implements a Genkit flow that analyzes uploaded file content
 * (text, images, videos, or audio) and suggests relevant tags or categories.
 *
 * - suggestContentTags - A function that handles the content tagging process.
 * - SuggestContentTagsInput - The input type for the suggestContentTags function.
 * - SuggestContentTagsOutput - The return type for the suggestContentTags function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestContentTagsInputSchema = z.object({
  content: z
    .string()
    .describe(
      'The content of the file. This should be a URL to the file or a data URI (data:<mimetype>;base64,<encoded_data>).'
    ),
  mimeType: z
    .string()
    .describe(
      'The MIME type of the content (e.g., text/plain, image/jpeg, application/pdf, video/mp4, audio/mpeg).' 
    ),
  fileName: z.string().optional().describe('The original file name.'),
});
export type SuggestContentTagsInput = z.infer<typeof SuggestContentTagsInputSchema>;

const SuggestContentTagsOutputSchema = z.object({
  tags: z.array(z.string()).describe('A list of suggested tags for the content.'),
});
export type SuggestContentTagsOutput = z.infer<typeof SuggestContentTagsOutputSchema>;

export async function suggestContentTags(input: SuggestContentTagsInput): Promise<SuggestContentTagsOutput> {
  return suggestContentTagsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentTagsPrompt',
  input: { schema: SuggestContentTagsInputSchema },
  output: { schema: SuggestContentTagsOutputSchema },
  prompt: `You are an expert content categorizer. Your task is to analyze the provided file content and suggest a list of relevant, concise, and descriptive tags or categories. These tags will be used to organize content efficiently.

If the content is an image or video, describe what you see or the main subject, then suggest tags.
If the content is an audio file (like MP3), analyze the sound, music, or speech (if you can process it) and suggest tags related to the genre, mood, or topic.
If the content is text, summarize its key themes or topics, then suggest tags.

Provide ONLY a JSON array of strings as your response. Do not include any other text, explanation, or conversational filler.

---
File Name: {{{fileName}}}
MIME Type: {{{mimeType}}}

Content: {{media url=content}}`,
});

const suggestContentTagsFlow = ai.defineFlow(
  {
    name: 'suggestContentTagsFlow',
    inputSchema: SuggestContentTagsInputSchema,
    outputSchema: SuggestContentTagsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
