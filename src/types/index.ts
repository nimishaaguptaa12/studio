// src/types/index.ts
export interface ItineraryDay {
  day: number;
  activities: string[];
  estimatedCost: number;
}

export type ChecklistItem = {
    id: number;
    text: string;
    completed: boolean;
};

export interface SavedTrip {
  id: string; // e.g., a timestamp or a unique hash
  destination: string;
  duration: number;
  preferences: string;
  budget: number;
  itinerary: ItineraryDay[];
  checklist: ChecklistItem[];
  createdAt: string;
}
