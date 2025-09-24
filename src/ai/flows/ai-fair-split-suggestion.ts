'use server';

/**
 * @fileOverview AI-powered suggestion for fairly splitting a non-divisible tip among friends.
 *
 * - fairSplitSuggestion - A function that suggests how to split the tip.
 * - FairSplitSuggestionInput - The input type for the fairSplitSuggestion function.
 * - FairSplitSuggestionOutput - The return type for the fairSplitSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FairSplitSuggestionInputSchema = z.object({
  tipAmount: z.number().describe('The total tip amount to be split.'),
  numPeople: z.number().describe('The number of people splitting the bill.'),
});
export type FairSplitSuggestionInput = z.infer<typeof FairSplitSuggestionInputSchema>;

const FairSplitSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('An AI-generated suggestion for splitting the tip fairly.'),
});
export type FairSplitSuggestionOutput = z.infer<typeof FairSplitSuggestionOutputSchema>;

export async function fairSplitSuggestion(input: FairSplitSuggestionInput): Promise<FairSplitSuggestionOutput> {
  return fairSplitSuggestionFlow(input);
}

const fairSplitSuggestionPrompt = ai.definePrompt({
  name: 'fairSplitSuggestionPrompt',
  input: {schema: FairSplitSuggestionInputSchema},
  output: {schema: FairSplitSuggestionOutputSchema},
  prompt: `We need to split a tip of {{tipAmount}} among {{numPeople}} people. Suggest a fair way to split the tip, considering it may not divide evenly. The suggestion should include how much each person should pay, and who should pay the extra amount if necessary, with reasoning. Make sure the suggested amounts add up to the tip amount.`,
});

const fairSplitSuggestionFlow = ai.defineFlow(
  {
    name: 'fairSplitSuggestionFlow',
    inputSchema: FairSplitSuggestionInputSchema,
    outputSchema: FairSplitSuggestionOutputSchema,
  },
  async input => {
    const {output} = await fairSplitSuggestionPrompt(input);
    return output!;
  }
);
