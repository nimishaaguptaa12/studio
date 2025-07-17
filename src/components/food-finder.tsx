// src/components/food-finder.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { suggestCafeRestaurant } from "@/ai/flows/ai-cafe-restaurant-finder";
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
import { Sparkles, UtensilsCrossed } from "lucide-react";

const formSchema = z.object({
  preferences: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

type FoodFinderProps = {
  destination: string;
};

export function FoodFinder({ destination }: FoodFinderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useLocalStorage<string[] | null>(`foodSuggestions-${destination}`, null);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferences: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setSuggestions(null);
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
    } finally {
      setIsLoading(false);
    }
  }

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
        
        {(isLoading || suggestions) && (
            <div className="mt-6">
            <h3 className="text-xl font-bold mb-4">Recommendations</h3>
             {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                ) : (
                <div className="space-y-3">
                    {suggestions?.map((suggestion, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-md border p-3">
                            <UtensilsCrossed className="h-5 w-5 text-muted-foreground" />
                            <p>{suggestion}</p>
                        </div>
                    ))}
                    {suggestions?.length === 0 && (
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
