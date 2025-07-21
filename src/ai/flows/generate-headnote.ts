'use server';

/**
 * @fileOverview AI agent that generates a headnote from a legal judgment PDF.
 *
 * - generateHeadnote - A function that handles the headnote generation process.
 * - GenerateHeadnoteInput - The input type for the generateHeadnote function.
 * - GenerateHeadnoteOutput - The return type for the generateHeadnote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHeadnoteInputSchema = z.object({
  judgmentPdfDataUri: z
    .string()
    .describe(
      "A legal judgment PDF, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateHeadnoteInput = z.infer<typeof GenerateHeadnoteInputSchema>;

const GenerateHeadnoteOutputSchema = z.object({
  headnote: z.string().describe('A concise headnote summarizing the judgment.'),
});
export type GenerateHeadnoteOutput = z.infer<typeof GenerateHeadnoteOutputSchema>;

export async function generateHeadnote(input: GenerateHeadnoteInput): Promise<GenerateHeadnoteOutput> {
  return generateHeadnoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHeadnotePrompt',
  input: {schema: GenerateHeadnoteInputSchema},
  output: {schema: GenerateHeadnoteOutputSchema},
  prompt: `You are an expert legal professional specializing in writing headnotes for legal judgments.

You will use the judgment provided to create a concise headnote summarizing the facts, legal issues, reasoning, and ruling.

Judgment: {{media url=judgmentPdfDataUri}}`,
});

const generateHeadnoteFlow = ai.defineFlow(
  {
    name: 'generateHeadnoteFlow',
    inputSchema: GenerateHeadnoteInputSchema,
    outputSchema: GenerateHeadnoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
