// src/app/(main)/booking/flights/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Plane, CalendarIcon, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const flightSearchSchema = z.object({
  from: z.string().min(1, "Please enter a departure location."),
  to: z.string().min(1, "Please enter a destination."),
  departure: z.date({
    required_error: "A departure date is required.",
  }),
  return: z.date().optional(),
  passengers: z.string().min(1, "Please select the number of passengers."),
});

type FlightSearchFormValues = z.infer<typeof flightSearchSchema>;

type FlightResult = {
  id: string;
  airline: string;
  from: string;
  to: string;
  stops: number;
  duration: string;
  price: number;
};

const mockFlightResults: FlightResult[] = [
  {
    id: "1",
    airline: "Delta Airlines",
    from: "JFK",
    to: "JTR",
    stops: 1,
    duration: "8h 45m",
    price: 892,
  },
  {
    id: "2",
    airline: "American Airlines",
    from: "JFK",
    to: "JTR",
    stops: 2,
    duration: "9h 30m",
    price: 756,
  },
  {
    id: "3",
    airline: "Emirates",
    from: "JFK",
    to: "JTR",
    stops: 1,
    duration: "12h 15m",
    price: 1245,
  },
];

export default function BookFlightsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [flights, setFlights] = useState<FlightResult[]>([]);

  const form = useForm<FlightSearchFormValues>({
    resolver: zodResolver(flightSearchSchema),
    defaultValues: {
      from: "Delhi",
      to: "Dubai",
      passengers: "1",
      departure: new Date(),
    },
  });

  function onSubmit(values: FlightSearchFormValues) {
    setIsLoading(true);
    setFlights([]);
    // Simulate API call
    setTimeout(() => {
      setFlights(mockFlightResults);
      setIsLoading(false);
    }, 1500);
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <Plane className="h-8 w-8 text-primary" />
            Flight Search
          </CardTitle>
          <CardDescription>
            Find the best deals on flights for your next adventure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input placeholder="New York (JFK)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input placeholder="Santorini (JTR)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="departure"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Departure</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="return"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Return</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date (optional)</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < form.getValues("departure") ||
                              date < new Date(new Date().setHours(0, 0, 0, 0))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="passengers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passengers</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of adults" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(8)].map((_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`}>
                            {i + 1} Adult{i > 0 && "s"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                <Search className="mr-2 h-4 w-4" />{" "}
                {isLoading ? "Searching..." : "Search Flights"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || flights.length > 0) && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
          <div className="space-y-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-6 w-20 mb-2" />
                        <Skeleton className="h-10 w-24" />
                      </div>
                    </div>
                  </Card>
                ))
              : flights.map((flight) => (
                  <Card key={flight.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                         <div className="bg-primary/10 p-2 rounded-full">
                           <Plane className="h-6 w-6 text-primary" />
                         </div>
                        <div>
                          <p className="font-bold text-lg">{flight.airline}</p>
                          <p className="text-sm text-muted-foreground">
                            {flight.from} → {flight.to} ({flight.stops} stop{flight.stops !== 1 && 's'})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {flight.duration}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold mb-2">
                          ${flight.price}
                        </p>
                        <Button>Select</Button>
                      </div>
                    </div>
                  </Card>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
