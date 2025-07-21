// src/ai/flows/compliance-suggestion.ts
'use server';
/**
 * @fileOverview A compliance suggestion AI agent.
 *
 * - getComplianceSuggestions - A function that handles the compliance suggestion process.
 * - ComplianceSuggestionInput - The input type for the getComplianceSuggestions function.
 * - ComplianceSuggestionOutput - The return type for the getComplianceSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComplianceSuggestionInputSchema = z.object({
  businessCaseDetails: z.string().describe('Details of the business case for which compliance suggestions are needed.'),
});
export type ComplianceSuggestionInput = z.infer<typeof ComplianceSuggestionInputSchema>;

const ComplianceSuggestionOutputSchema = z.object({
  suggestedForms: z.string().describe('The suggested legal forms relevant to the business case.'),
  filingRequirements: z.string().describe('The filing requirements associated with the business case.'),
  relevantDeadlines: z.string().describe('The deadlines for compliance related to the business case.'),
  potentialPenalties: z.string().describe('The potential penalties for non-compliance in the business case.'),
});
export type ComplianceSuggestionOutput = z.infer<typeof ComplianceSuggestionOutputSchema>;

export async function getComplianceSuggestions(input: ComplianceSuggestionInput): Promise<ComplianceSuggestionOutput> {
  return complianceSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'complianceSuggestionPrompt',
  input: {schema: ComplianceSuggestionInputSchema},
  output: {schema: ComplianceSuggestionOutputSchema},
  prompt: `You are an AI assistant specialized in legal compliance.

  Based on the details of the business case provided, suggest the correct legal forms, filing requirements, relevant deadlines, and potential penalties.

  Business Case Details: {{{businessCaseDetails}}}
  \n\n  Format your answer as follows:\n  Suggested Forms: <suggested legal forms>\n  Filing Requirements: <filing requirements>\n  Relevant Deadlines: <deadlines>\n  Potential Penalties: <penalties>`,
});

const complianceSuggestionFlow = ai.defineFlow(
  {
    name: 'complianceSuggestionFlow',
    inputSchema: ComplianceSuggestionInputSchema,
    outputSchema: ComplianceSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
