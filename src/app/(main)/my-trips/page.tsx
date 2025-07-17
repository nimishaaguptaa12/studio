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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Bookmark, CalendarDays, ListChecks, Share2, FilePenLine, UtensilsCrossed } from "lucide-react";
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

  const handleChecklistItemToggle = (tripId: string, itemId: number) => {
    const updatedTrips = savedTrips.map(trip => {
        if (trip.id === tripId) {
            const updatedChecklist = trip.checklist.map(item => {
                if (item.id === itemId) {
                    return { ...item, completed: !item.completed };
                }
                return item;
            });
            return { ...trip, checklist: updatedChecklist };
        }
        return trip;
    });
    setSavedTrips(updatedTrips);
  };
  
  const handleShareTrip = async (trip: SavedTrip) => {
    const tripUrl = `${window.location.origin}/itinerary?destination=${encodeURIComponent(trip.destination)}`;
    const shareTitle = `My Trip to ${trip.destination}`;
    let shareText = `Check out my upcoming ${trip.duration}-day trip to ${trip.destination}!\n\n`;
    shareText += `View the full plan here: ${tripUrl}\n\n`;
    shareText += 'Itinerary:\n';
    trip.itinerary.forEach(day => {
        shareText += `Day ${day.day}:\n`;
        day.activities.forEach(activity => {
            shareText += `- ${activity}\n`;
        });
    });

    if (navigator.share) {
        try {
            await navigator.share({
                title: shareTitle,
                text: shareText,
                url: tripUrl,
            });
            toast({ title: "Trip shared successfully!" });
        } catch (error) {
            console.error("Error sharing trip:", error);
            toast({
                title: "Could not share trip",
                description: "There was an error trying to share your trip.",
                variant: "destructive"
            });
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareText);
            toast({
                title: "Copied to Clipboard",
                description: "Trip details have been copied to your clipboard.",
            });
        } catch (error) {
            console.error("Error copying to clipboard:", error);
            toast({
                title: "Could not copy trip",
                description: "There was an error trying to copy your trip details.",
                variant: "destructive"
            });
        }
    }
  }


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
            Here are all the itineraries and checklists you've saved.
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
                    <Tabs defaultValue="itinerary" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="itinerary">
                               <CalendarDays className="mr-2 h-4 w-4" /> Itinerary
                            </TabsTrigger>
                            <TabsTrigger value="checklist">
                                <ListChecks className="mr-2 h-4 w-4" /> Checklist
                            </TabsTrigger>
                            <TabsTrigger value="food">
                                <UtensilsCrossed className="mr-2 h-4 w-4" /> Food
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="itinerary">
                           <div className="space-y-4">
                              {trip.itinerary.map((day) => (
                                <div key={day.day} className="rounded-md border p-3">
                                  <p className="font-semibold">
                                    Day {day.day} (Est. ₹{day.estimatedCost.toLocaleString('en-IN')})
                                  </p>
                                  <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
                                    {day.activities.map((activity, i) => (
                                      <li key={i}>{activity}</li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                        </TabsContent>
                        <TabsContent value="checklist">
                            <div className="space-y-2">
                                {trip.checklist && trip.checklist.length > 0 ? (
                                    trip.checklist.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
                                        >
                                            <Checkbox
                                                id={`trip-${trip.id}-item-${item.id}`}
                                                checked={item.completed}
                                                onCheckedChange={() => handleChecklistItemToggle(trip.id, item.id)}
                                            />
                                            <label
                                                htmlFor={`trip-${trip.id}-item-${item.id}`}
                                                className={`flex-1 cursor-pointer ${
                                                item.completed ? "text-muted-foreground line-through" : ""
                                                }`}
                                            >
                                                {item.text}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">No checklist was saved for this trip.</p>
                                )}
                            </div>
                        </TabsContent>
                         <TabsContent value="food">
                            <div className="space-y-2">
                                {trip.foodSuggestions && trip.foodSuggestions.length > 0 ? (
                                    trip.foodSuggestions.map((suggestion, i) => (
                                       <div key={i} className="flex items-center gap-3 rounded-md border p-3">
                                            <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                                            <p>{suggestion}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">No food suggestions were saved for this trip.</p>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                        <Button variant="outline" size="sm" asChild>
                           <Link href={`/itinerary?destination=${encodeURIComponent(trip.destination)}&duration=${trip.duration}&budget=${trip.budget}&preferences=${encodeURIComponent(trip.preferences)}`}>
                             <FilePenLine className="mr-2 h-4 w-4" /> Resume Planning
                           </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareTrip(trip)}
                        >
                            <Share2 className="mr-2 h-4 w-4" /> Share Trip
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTrip(trip.id)}
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
              <Link href="/destinations">
                <Button className="mt-4">Find a Destination</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
