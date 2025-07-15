'use server';
/**
 * @fileOverview An AI agent for suggesting cafes and restaurants in a destination.
 *
 * - suggestCafeRestaurant - A function that handles the cafe/restaurant suggestion process.
 * - SuggestCafeRestaurantInput - The input type for the suggestCafeRestaurant function.
 * - SuggestCafeRestaurantOutput - The return type for the suggestCafeRestaurant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCafeRestaurantInputSchema = z.object({
  destination: z.string().describe('The destination for which to suggest cafes and restaurants.'),
  preferences: z.string().optional().describe('Optional user preferences for the type of cafe or restaurant.'),
});
export type SuggestCafeRestaurantInput = z.infer<typeof SuggestCafeRestaurantInputSchema>;

const SuggestCafeRestaurantOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of cafe and restaurant suggestions.'),
});
export type SuggestCafeRestaurantOutput = z.infer<typeof SuggestCafeRestaurantOutputSchema>;

export async function suggestCafeRestaurant(input: SuggestCafeRestaurantInput): Promise<SuggestCafeRestaurantOutput> {
  return suggestCafeRestaurantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCafeRestaurantPrompt',
  input: {schema: SuggestCafeRestaurantInputSchema},
  output: {schema: SuggestCafeRestaurantOutputSchema},
  prompt: `Suggest cafes and restaurants in {{destination}}.{{#if preferences}} Consider the following preferences: {{preferences}}.{{/if}}

  Return an array of suggestions.`, 
});

const suggestCafeRestaurantFlow = ai.defineFlow(
  {
    name: 'suggestCafeRestaurantFlow',
    inputSchema: SuggestCafeRestaurantInputSchema,
    outputSchema: SuggestCafeRestaurantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
