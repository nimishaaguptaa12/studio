// src/app/(main)/itinerary/page.tsx
"use client";

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItineraryPlanner } from "@/components/itinerary-planner";
import { FoodFinder } from "@/components/food-finder";
import { Checklist } from "@/components/checklist";
import { CalendarDays, UtensilsCrossed, ListChecks } from "lucide-react";

function ItineraryPageContent() {
  const searchParams = useSearchParams();
  const destination = searchParams.get("destination");

  if (!destination) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold">No Destination Selected</h1>
        <p className="text-muted-foreground">
          Please find a destination first to plan your itinerary.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <Tabs defaultValue="itinerary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="itinerary">
            <CalendarDays className="mr-2 h-4 w-4" /> Itinerary
          </TabsTrigger>
          <TabsTrigger value="food">
            <UtensilsCrossed className="mr-2 h-4 w-4" /> Food & Drink
          </TabsTrigger>
          <TabsTrigger value="checklist">
            <ListChecks className="mr-2 h-4 w-4" /> Checklist
          </TabsTrigger>
        </TabsList>
        <TabsContent value="itinerary" className="mt-4">
          <ItineraryPlanner destination={destination} />
        </TabsContent>
        <TabsContent value="food" className="mt-4">
          <FoodFinder destination={destination} />
        </TabsContent>
        <TabsContent value="checklist" className="mt-4">
          <Checklist />
        </TabsContent>
      </Tabs>
    </div>
  );
}


export default function ItineraryPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ItineraryPageContent />
        </Suspense>
    )
}
