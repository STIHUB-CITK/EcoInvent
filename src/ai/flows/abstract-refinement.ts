// The abstract refinement flow provides suggestions to improve abstracts based on successful submissions and current environmental trends.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AbstractRefinementInputSchema = z.object({
  abstractText: z.string().describe('The text of the abstract to be refined.'),
  ideathonCategory: z
    .string()
    .describe(
      'The category of the ideathon submission (e.g., Sustainable Fashion, Waste to Wealth).'
    ),
  currentEnvironmentalTrends: z
    .string()
    .describe('A description of current environmental trends related to the ideathon category.'),
  successfulSubmissionExamples: z
    .string()
    .describe('Examples of successful abstract submissions from previous ideathons.'),
});

export type AbstractRefinementInput = z.infer<typeof AbstractRefinementInputSchema>;

const AbstractRefinementOutputSchema = z.object({
  refinedAbstract: z
    .string()
    .describe('The refined abstract text with improvements based on AI suggestions.'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improving the abstract.'),
});

export type AbstractRefinementOutput = z.infer<typeof AbstractRefinementOutputSchema>;

export async function refineAbstract(
  input: AbstractRefinementInput
): Promise<AbstractRefinementOutput> {
  return abstractRefinementFlow(input);
}

const abstractRefinementPrompt = ai.definePrompt({
  name: 'abstractRefinementPrompt',
  input: {schema: AbstractRefinementInputSchema},
  output: {schema: AbstractRefinementOutputSchema},
  prompt: `You are an AI assistant that helps refine abstracts for the EcoInvent Ideathon.

  Based on the provided abstract text, ideathon category, current environmental trends, and examples of successful submissions, provide a refined version of the abstract and specific suggestions for improvement.

  Abstract Text: {{{abstractText}}}
  Ideathon Category: {{{ideathonCategory}}}
  Current Environmental Trends: {{{currentEnvironmentalTrends}}}
  Successful Submission Examples: {{{successfulSubmissionExamples}}}

  Refined Abstract: A refined version of the abstract incorporating suggestions for improvement.
  Suggestions: A list of specific suggestions for improving the abstract.  Each suggestion should be actionable.
  `,
});

const abstractRefinementFlow = ai.defineFlow(
  {
    name: 'abstractRefinementFlow',
    inputSchema: AbstractRefinementInputSchema,
    outputSchema: AbstractRefinementOutputSchema,
  },
  async input => {
    const {output} = await abstractRefinementPrompt(input);
    return output!;
  }
);
