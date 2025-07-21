'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing legal news, trends, and government circulars related to a specific legal topic.
 *
 * - summarizeLegalNews - A function that takes a legal topic as input and returns a summary of relevant news.
 * - SummarizeLegalNewsInput - The input type for the summarizeLegalNews function.
 * - SummarizeLegalNewsOutput - The return type for the summarizeLegalNews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLegalNewsInputSchema = z.object({
  legalTopic: z.string().describe('The legal topic to summarize news for.'),
});
export type SummarizeLegalNewsInput = z.infer<typeof SummarizeLegalNewsInputSchema>;

const SummarizeLegalNewsOutputSchema = z.object({
  summary: z.string().describe('A summary of relevant news, legal trends, and government circulars.'),
});
export type SummarizeLegalNewsOutput = z.infer<typeof SummarizeLegalNewsOutputSchema>;

export async function summarizeLegalNews(input: SummarizeLegalNewsInput): Promise<SummarizeLegalNewsOutput> {
  return summarizeLegalNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLegalNewsPrompt',
  input: {schema: SummarizeLegalNewsInputSchema},
  output: {schema: SummarizeLegalNewsOutputSchema},
  prompt: `You are a legal expert. Summarize the latest news, legal trends, and government circulars related to the following legal topic: {{{legalTopic}}}. Focus on providing information that is relevant to legal professionals.`,
});

const summarizeLegalNewsFlow = ai.defineFlow(
  {
    name: 'summarizeLegalNewsFlow',
    inputSchema: SummarizeLegalNewsInputSchema,
    outputSchema: SummarizeLegalNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
