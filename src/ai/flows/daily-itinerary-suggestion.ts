// src/ai/flows/daily-itinerary-suggestion.ts
'use server';

/**
 * @fileOverview Generates daily itinerary suggestions based on user preferences and budget.
 *
 * - generateDailyItinerary - A function that generates daily itinerary suggestions.
 * - DailyItineraryInput - The input type for the generateDailyItinerary function.
 * - DailyItineraryOutput - The return type for the generateDailyItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DailyItineraryInputSchema = z.object({
  destination: z.string().describe('The destination for the trip.'),
  duration: z.number().describe('The duration of the trip in days.'),
  preferences: z.string().describe('The user preferences for activities and interests.'),
  budget: z.number().describe('The daily budget for the itinerary.'),
});
export type DailyItineraryInput = z.infer<typeof DailyItineraryInputSchema>;

const DailyItineraryOutputSchema = z.object({
  itinerary: z.array(
    z.object({
      day: z.number().describe('The day number in the itinerary.'),
      activities: z.array(z.string()).describe('A list of suggested activities for the day.'),
      estimatedCost: z.number().describe('The estimated cost for the day in USD.'),
    })
  ).describe('A list of daily itineraries.'),
});

export type DailyItineraryOutput = z.infer<typeof DailyItineraryOutputSchema>;

export async function generateDailyItinerary(input: DailyItineraryInput): Promise<DailyItineraryOutput> {
  return dailyItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'dailyItineraryPrompt',
  input: {schema: DailyItineraryInputSchema},
  output: {schema: DailyItineraryOutputSchema},
  prompt: `You are an expert travel planner. Generate a daily itinerary for a trip to {{{destination}}} that lasts {{{duration}}} days.

The user has the following preferences: {{{preferences}}}.

The daily budget is ${{{budget}}} USD. Make sure the estimatedCost for each day is within the budget.

Return the itinerary as a JSON object.
`,
});

const dailyItineraryFlow = ai.defineFlow(
  {
    name: 'dailyItineraryFlow',
    inputSchema: DailyItineraryInputSchema,
    outputSchema: DailyItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
