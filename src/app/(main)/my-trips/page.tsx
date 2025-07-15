// src/app/(main)/my-trips/page.tsx
"use client";

import useLocalStorage from "@/hooks/use-local-storage";
import type { SavedTrip } from "@/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

export default function MyTripsPage() {
  const [savedTrips, setSavedTrips] = useLocalStorage<SavedTrip[]>("savedTrips", []);
  const { toast } = useToast();

  const handleDeleteTrip = (id: string) => {
    const updatedTrips = savedTrips.filter((trip) => trip.id !== id);
    setSavedTrips(updatedTrips);
    toast({
      title: "Trip Deleted",
      description: "The trip has been removed from your saved list.",
    });
  };

  const sortedTrips = [...savedTrips].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <Bookmark className="h-8 w-8 text-primary" />
            My Saved Trips
          </CardTitle>
          <CardDescription>
            Here are all the itineraries you've saved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedTrips.length > 0 ? (
            <Accordion type="multiple" className="w-full space-y-4">
              {sortedTrips.map((trip) => (
                <AccordionItem
                  value={trip.id}
                  key={trip.id}
                  className="rounded-lg border bg-card"
                >
                  <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex w-full items-center justify-between gap-4">
                      <div className="text-left flex-1 min-w-0">
                        <p className="text-lg font-semibold truncate">{trip.destination}</p>
                        <p className="text-sm text-muted-foreground">
                          {trip.duration} days, created on{" "}
                          {new Date(trip.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4 pt-0">
                    <div className="space-y-4">
                      {trip.itinerary.map((day) => (
                        <div key={day.day} className="rounded-md border p-3">
                          <p className="font-semibold">
                            Day {day.day} (Est. ${day.estimatedCost})
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                            {day.activities.map((activity, i) => (
                              <li key={i}>{activity}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTrip(trip.id)}
                        className="mt-4"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Trip
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center">
              <h3 className="text-xl font-semibold">No saved trips yet!</h3>
              <p className="mt-2 text-muted-foreground">
                Start by finding a destination and planning your itinerary.
              </p>
              <Link href="/">
                <Button className="mt-4">Find a Destination</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
