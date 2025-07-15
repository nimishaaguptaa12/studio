// src/components/checklist.tsx
"use client";

import { useState } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

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

export function Checklist() {
  const [items, setItems] = useLocalStorage<ChecklistItem[]>("tripChecklist", defaultChecklist);
  const [newItemText, setNewItemText] = useState("");

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pre-trip Checklist</CardTitle>
        <CardDescription>
          Stay organized and make sure you have everything you need for your trip.
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
          {items.map((item) => (
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
          ))}
          {items.length === 0 && (
            <p className="text-center text-muted-foreground py-4">Your checklist is empty. Add some items to get started!</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
