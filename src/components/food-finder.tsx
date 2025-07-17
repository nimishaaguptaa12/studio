// src/components/food-finder.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { suggestCafeRestaurant, type RestaurantSuggestion } from "@/ai/flows/ai-cafe-restaurant-finder";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import useLocalStorage from "@/hooks/use-local-storage";
import { Sparkles, UtensilsCrossed, ExternalLink } from "lucide-react";

const formSchema = z.object({
  preferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type FoodFinderProps = {
  destination: string;
};

export function FoodFinder({ destination }: FoodFinderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useLocalStorage<RestaurantSuggestion[] | null>(`foodSuggestions-${destination}`, null);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setHasSearched(true);
    setSuggestions(null); // Clear previous suggestions
    try {
      const result = await suggestCafeRestaurant({
        destination,
        preferences: values.preferences,
      });
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to find restaurants. Please try again.",
        variant: "destructive",
      });
      setSuggestions([]); // Set to empty array on error to show message
    } finally {
      setIsLoading(false);
    }
  }

  // Clear suggestions and search state when destination changes
  useEffect(() => {
    setSuggestions(null);
    setHasSearched(false);
    form.reset();
  }, [destination, setSuggestions, form]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Find Cafes & Restaurants in {destination}</CardTitle>
        <CardDescription>
          Get AI-powered recommendations for the best places to eat and drink.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferences (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 'cozy cafes with good coffee', 'vegetarian options', 'seafood'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Searching..." : "Find Food"}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </Form>
        
        {(isLoading || (hasSearched && suggestions)) && (
            <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Recommendations</h3>
             {isLoading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4 rounded-md border p-3">
                             <Skeleton className="h-5 w-5 rounded-full" />
                             <div className="flex-grow space-y-2">
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-3/4" />
                             </div>
                        </div>
                    ))}
                </div>
                ) : (
                <div className="space-y-3">
                    {suggestions && suggestions.length > 0 ? (
                        suggestions.map((suggestion, i) => (
                           <a
                            key={i}
                            href={`https://www.google.com/search?q=${encodeURIComponent(`${suggestion.name}, ${destination}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 rounded-md border p-3 transition-colors hover:bg-muted/50"
                           >
                             <UtensilsCrossed className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                             <div className="flex-grow">
                                <p className="font-semibold">{suggestion.name}</p>
                                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                             </div>
                             <ExternalLink className="h-4 w-4 text-muted-foreground" />
                           </a>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">No suggestions found. Try broadening your search.</p>
                    )}
                </div>
            )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}
