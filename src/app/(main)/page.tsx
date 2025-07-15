// src/app/(main)/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, Sparkles } from "lucide-react";
import { suggestDestinations } from "@/ai/flows/suggest-destinations";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  preferences: z.string().min(10, {
    message: "Please tell us a bit more about what you're looking for.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function DestinationFinderPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [destinations, setDestinations] = useState<string[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setDestinations([]);
    try {
      const result = await suggestDestinations({
        preferences: values.preferences,
      });
      setDestinations(result.destinations);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to suggest destinations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <Card className="border-0 shadow-none md:border md:shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <Sparkles className="h-8 w-8 text-accent" />
            Smart Destination Finder
          </CardTitle>
          <CardDescription>
            Describe your ideal trip, and our AI will suggest the perfect
            destinations for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A relaxing beach vacation in Southeast Asia with great food, budget-friendly, and opportunities for snorkeling.' or 'A cultural trip to Europe, interested in history, museums, and good wine.'"
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Include details like budget, travel style, interests, and
                      desired region.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} size="lg" className="w-full sm:w-auto">
                {isLoading ? "Thinking..." : "Find Destinations"}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(isLoading || destinations.length > 0) && (
        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-bold">Your Suggested Destinations</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-16 w-full" />
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              : destinations.map((dest) => (
                  <Card key={dest}>
                    <CardHeader>
                      <CardTitle>{dest}</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Link
                        href={`/itinerary?destination=${encodeURIComponent(
                          dest
                        )}`}
                        className="w-full"
                      >
                        <Button className="w-full" variant="outline">
                          Plan Itinerary <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
