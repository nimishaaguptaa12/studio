'use server';
/**
 * @fileOverview An AI agent for suggesting checklist items for a trip.
 *
 * - suggestChecklistItems - A function that handles the checklist item suggestion process.
 * - SuggestChecklistItemsInput - The input type for the suggestChecklistItems function.
 * - SuggestChecklistItemsOutput - The return type for the suggestChecklistItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestChecklistItemsInputSchema = z.object({
  destination: z.string().describe('The destination for which to suggest checklist items.'),
});
export type SuggestChecklistItemsInput = z.infer<typeof SuggestChecklistItemsInputSchema>;

const SuggestChecklistItemsOutputSchema = z.object({
  checklist: z
    .array(z.string())
    .describe(
      'An array of personalized checklist item suggestions for the trip. These should be short, actionable items.'
    ),
});
export type SuggestChecklistItemsOutput = z.infer<typeof SuggestChecklistItemsOutputSchema>;

export async function suggestChecklistItems(
  input: SuggestChecklistItemsInput
): Promise<SuggestChecklistItemsOutput> {
  return suggestChecklistItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestChecklistItemsPrompt',
  input: {schema: SuggestChecklistItemsInputSchema},
  output: {schema: SuggestChecklistItemsOutputSchema},
  prompt: `You are a helpful travel assistant. Generate a short, personalized pre-trip checklist for a trip to {{{destination}}}. 

Include essential general items, but also add 2-3 specific items tailored to the destination. For example, if the destination is a tropical beach, suggest "Pack reef-safe sunscreen". If it's a mountain destination, suggest "Bring sturdy hiking boots".

Keep the items concise and actionable. Return an array of checklist strings.`,
});

const suggestChecklistItemsFlow = ai.defineFlow(
  {
    name: 'suggestChecklistItemsFlow',
    inputSchema: SuggestChecklistItemsInputSchema,
    outputSchema: SuggestChecklistItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
