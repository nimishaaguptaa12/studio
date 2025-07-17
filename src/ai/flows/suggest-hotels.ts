'use server';
/**
 * @fileOverview An AI agent for suggesting hotels in a destination.
 *
 * - suggestHotels - A function that handles the hotel suggestion process.
 * - SuggestHotelsInput - The input type for the suggestHotels function.
 * - SuggestHotelsOutput - The return type for the suggestHotels function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestHotelsInputSchema = z.object({
  destination: z.string().describe('The destination for which to suggest hotels.'),
});
export type SuggestHotelsInput = z.infer<typeof SuggestHotelsInputSchema>;

const HotelSuggestionSchema = z.object({
    name: z.string().describe('The name of the hotel.'),
    rating: z.number().describe('The star rating of the hotel, from 1 to 5.'),
    pricePerNight: z.number().describe('The estimated price per night in INR.'),
});

const SuggestHotelsOutputSchema = z.object({
  hotels: z.array(HotelSuggestionSchema).describe('An array of 3-5 hotel suggestions.'),
});
export type SuggestHotelsOutput = z.infer<typeof SuggestHotelsOutputSchema>;

export async function suggestHotels(input: SuggestHotelsInput): Promise<SuggestHotelsOutput> {
  return suggestHotelsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHotelsPrompt',
  input: {schema: SuggestHotelsInputSchema},
  output: {schema: SuggestHotelsOutputSchema},
  prompt: `You are a travel agent. Suggest 3 to 5 hotels for a user traveling to {{destination}}.
  
  For each hotel, provide its name, star rating (1-5), and an estimated price per night in INR.
  
  Return the suggestions as a JSON object with a 'hotels' array.`,
});

const suggestHotelsFlow = ai.defineFlow(
  {
    name: 'suggestHotelsFlow',
    inputSchema: SuggestHotelsInputSchema,
    outputSchema: SuggestHotelsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
