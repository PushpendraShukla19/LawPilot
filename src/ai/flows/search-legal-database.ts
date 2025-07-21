'use server';

/**
 * @fileOverview AI agent for searching a legal database.
 *
 * - searchLegalDatabase - A function that handles searching for legal judgments.
 * - SearchLegalDatabaseInput - The input type for the searchLegalDatabase function.
 * - SearchLegalDatabaseOutput - The return type for the searchLegalDatabase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const JudgmentSchema = z.object({
  id: z.number().describe('A unique identifier for the judgment.'),
  title: z.string().describe('The title of the case.'),
  court: z.string().describe('The court that issued the judgment.'),
  date: z.string().describe('The date the judgment was issued.'),
  sections: z.array(z.string()).describe('Relevant IPC/CrPC sections mentioned.'),
  keywords: z.array(z.string()).describe('Keywords summarizing the judgment.'),
});

const SearchLegalDatabaseInputSchema = z.object({
  ipcCrpcSections: z.string().optional().describe('Filter by IPC/CrPC sections.'),
  topics: z.string().optional().describe('Filter by legal topics.'),
  court: z.string().optional().describe('Filter by the name of the court.'),
  headnoteKeywords: z.string().optional().describe('Filter by keywords in the headnote.'),
});
export type SearchLegalDatabaseInput = z.infer<typeof SearchLegalDatabaseInputSchema>;

const SearchLegalDatabaseOutputSchema = z.object({
  judgments: z.array(JudgmentSchema),
});
export type SearchLegalDatabaseOutput = z.infer<typeof SearchLegalDatabaseOutputSchema>;

export async function searchLegalDatabase(input: SearchLegalDatabaseInput): Promise<SearchLegalDatabaseOutput> {
  return searchLegalDatabaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'searchLegalDatabasePrompt',
  input: {schema: SearchLegalDatabaseInputSchema},
  output: {schema: SearchLegalDatabaseOutputSchema},
  prompt: `You are an AI assistant for a legal database. Your task is to find judgments based on the provided search criteria.

You have access to a database of landmark Indian and international judgments. Return a list of 3-5 judgments that match the user's query. If no criteria are provided, return a list of recent landmark judgments.

Search Criteria:
- IPC/CrPC Sections: {{{ipcCrpcSections}}}
- Topics: {{{topics}}}
- Court: {{{court}}}
- Headnote Keywords: {{{headnoteKeywords}}}

Please provide the search results in the specified JSON format.
`,
});

const searchLegalDatabaseFlow = ai.defineFlow(
  {
    name: 'searchLegalDatabaseFlow',
    inputSchema: SearchLegalDatabaseInputSchema,
    outputSchema: SearchLegalDatabaseOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
