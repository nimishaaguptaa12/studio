// src/components/checklist.tsx
"use client";

import { useState, useEffect } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Sparkles } from "lucide-react";
import { suggestChecklistItems } from "@/ai/flows/suggest-checklist-items";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

type ChecklistItem = {
  id: number;
  text: string;
  completed: boolean;
};

const defaultChecklist: ChecklistItem[] = [
    { id: 1, text: "Book flights", completed: false },
    { id: 2, text: "Book accommodation", completed: false },
    { id: 3, text: "Pack passport and visas", completed: false },
];

export function Checklist({ destination }: { destination: string }) {
  const [items, setItems] = useLocalStorage<ChecklistItem[]>(`tripChecklist-${destination}`, defaultChecklist);
  const [newItemText, setNewItemText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim() === "") return;
    const newItem: ChecklistItem = {
      id: Date.now(),
      text: newItemText,
      completed: false,
    };
    setItems([...items, newItem]);
    setNewItemText("");
  };

  const toggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };
  
  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
        const result = await suggestChecklistItems({ destination });
        const newItems = result.checklist.map((itemText, index) => ({
            id: Date.now() + index,
            text: itemText,
            completed: false
        }));
        setItems(newItems);
        toast({
            title: "Checklist Updated!",
            description: `Generated a new checklist for your trip to ${destination}.`,
        });
    } catch(error) {
        console.error(error);
        toast({
            title: "Error",
            description: "Failed to generate checklist suggestions. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    // Only generate suggestions if the checklist is the default one
    const isDefault = JSON.stringify(items) === JSON.stringify(defaultChecklist);
    if(destination && isDefault){
        generateSuggestions();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-trip Checklist for {destination}</CardTitle>
        <CardDescription>
          Stay organized with this personalized checklist for your trip.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
          <Input
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add a new checklist item..."
          />
          <Button type="submit" size="icon" aria-label="Add item">
            <Plus className="h-4 w-4" />
          </Button>
        </form>

        <div className="space-y-2">
            {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            ) : items.map((item) => (
                <div
                key={item.id}
                className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
                >
                <Checkbox
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                />
                <label
                    htmlFor={`item-${item.id}`}
                    className={`flex-1 cursor-pointer ${
                    item.completed ? "text-muted-foreground line-through" : ""
                    }`}
                >
                    {item.text}
                </label>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteItem(item.id)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    aria-label="Delete item"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                </div>
            ))
          }
          {items.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground py-4">Your checklist is empty. Add some items to get started!</p>
          )}
        </div>
        <Button onClick={generateSuggestions} disabled={isLoading} variant="outline" className="mt-4">
            {isLoading ? "Generating..." : "Regenerate with AI"}
            <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
