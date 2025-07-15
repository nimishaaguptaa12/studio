// src/types/index.ts
export interface ItineraryDay {
  day: number;
  activities: string[];
  estimatedCost: number;
}

export interface SavedTrip {
  id: string; // e.g., a timestamp or a unique hash
  destination: string;
  duration: number;
  preferences: string;
  budget: number;
  itinerary: ItineraryDay[];
  createdAt: string;
}
