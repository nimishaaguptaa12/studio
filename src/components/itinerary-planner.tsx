// src/components/itinerary-planner.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateDailyItinerary } from "@/ai/flows/daily-itinerary-suggestion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import type { ItineraryDay, SavedTrip, ChecklistItem } from "@/types";
import { Bookmark, Sparkles } from "lucide-react";

const formSchema = z.object({
  duration: z.coerce.number().min(1).max(30),
  preferences: z.string().min(10),
  budget: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

type ItineraryPlannerProps = {
  destination: string;
};

export function ItineraryPlanner({ destination }: ItineraryPlannerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<ItineraryDay[] | null>(null);
  const [savedTrips, setSavedTrips] = useLocalStorage<SavedTrip[]>("savedTrips", []);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      duration: 7,
      preferences: "A mix of cultural sights, local food experiences, and some relaxation.",
      budget: 12000,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setItinerary(null);
    try {
      const result = await generateDailyItinerary({
        destination,
        ...values,
      });
      setItinerary(result.itinerary);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveTrip = () => {
    if (!itinerary) return;

    const checklistKey = `tripChecklist-${destination}`;
    let checklist: ChecklistItem[] = [];
    try {
      const storedChecklist = localStorage.getItem(checklistKey);
      if (storedChecklist) {
        checklist = JSON.parse(storedChecklist);
      }
    } catch (error) {
        console.error("Could not read checklist from localStorage", error);
    }

    const newTrip: SavedTrip = {
      id: new Date().toISOString(),
      destination,
      itinerary,
      checklist,
      ...form.getValues(),
      createdAt: new Date().toISOString(),
    };

    setSavedTrips([...savedTrips, newTrip]);
    toast({
      title: "Trip Saved!",
      description: `${destination} has been added to your saved trips.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan Your Itinerary for {destination}</CardTitle>
        <CardDescription>
          Fill in the details below to get a customized daily plan from our AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (days)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Budget (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferences</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., history, hiking, nightlife" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Itinerary"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
        
        {(isLoading || itinerary) && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Your Custom Itinerary</h3>
                {itinerary && (
                    <Button variant="outline" onClick={handleSaveTrip}>
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save Trip
                    </Button>
                )}
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {itinerary?.map((day) => (
                  <AccordionItem value={`day-${day.day}`} key={day.day}>
                    <AccordionTrigger>
                      <div className="flex justify-between w-full pr-4">
                        <span>Day {day.day}</span>
                        <span className="text-muted-foreground">
                          Est. ₹{day.estimatedCost.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc space-y-2 pl-6">
                        {day.activities.map((activity, i) => (
                          <li key={i}>{activity}</li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
