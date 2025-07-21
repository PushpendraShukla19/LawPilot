'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating legal reply suggestions based on uploaded court orders.
 *
 * - suggestLegalReplies -  A function that takes court order as input and returns AI-generated suggestions for replies and drafts.
 * - SuggestLegalRepliesInput - The input type for the suggestLegalReplies function.
 * - SuggestLegalRepliesOutput - The return type for the suggestLegalReplies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLegalRepliesInputSchema = z.object({
  courtOrderDataUri: z
    .string()
    .describe(
      "A court order document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SuggestLegalRepliesInput = z.infer<typeof SuggestLegalRepliesInputSchema>;

const SuggestLegalRepliesOutputSchema = z.object({
  suggestedReplies: z.array(z.string()).describe('AI-generated suggestions for replies to the court order.'),
  relevantCaseLaw: z.array(z.string()).describe('Relevant case law cited from Indian and global courts.'),
  litigationStrategy: z.string().describe('Litigation strategy and precedent strength analysis.'),
});
export type SuggestLegalRepliesOutput = z.infer<typeof SuggestLegalRepliesOutputSchema>;

export async function suggestLegalReplies(input: SuggestLegalRepliesInput): Promise<SuggestLegalRepliesOutput> {
  return suggestLegalRepliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLegalRepliesPrompt',
  input: {schema: SuggestLegalRepliesInputSchema},
  output: {schema: SuggestLegalRepliesOutputSchema},
  prompt: `You are an AI legal assistant specializing in drafting legal replies to court orders.

You will analyze the provided court order and generate suggestions for replies and drafts, incorporating relevant case law from Indian and global courts. Provide a litigation strategy and assess precedent strength.

Court Order: {{media url=courtOrderDataUri}}

Please provide the suggested replies, relevant case law, and litigation strategy based on the court order.
`,
});

const suggestLegalRepliesFlow = ai.defineFlow(
  {
    name: 'suggestLegalRepliesFlow',
    inputSchema: SuggestLegalRepliesInputSchema,
    outputSchema: SuggestLegalRepliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
