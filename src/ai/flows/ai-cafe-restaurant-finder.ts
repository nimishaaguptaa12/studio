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

const RestaurantSuggestionSchema = z.object({
    name: z.string().describe("The name of the cafe or restaurant."),
    description: z.string().describe("A brief, one-sentence description of the place, including its vibe, specialties, or what makes it unique."),
});
export type RestaurantSuggestion = z.infer<typeof RestaurantSuggestionSchema>;


const SuggestCafeRestaurantOutputSchema = z.object({
  suggestions: z.array(RestaurantSuggestionSchema).describe('An array of 3-5 cafe and restaurant suggestions.'),
});
export type SuggestCafeRestaurantOutput = z.infer<typeof SuggestCafeRestaurantOutputSchema>;

export async function suggestCafeRestaurant(input: SuggestCafeRestaurantInput): Promise<SuggestCafeRestaurantOutput> {
  return suggestCafeRestaurantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCafeRestaurantPrompt',
  input: {schema: SuggestCafeRestaurantInputSchema},
  output: {schema: SuggestCafeRestaurantOutputSchema},
  prompt: `Suggest 3 to 5 cafes and restaurants in {{destination}}.
  {{#if preferences}} Consider the following preferences: {{preferences}}.{{/if}}

  For each suggestion, provide the name and a brief, one-sentence description.
  Return the suggestions as a JSON object with a 'suggestions' array.`,
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
