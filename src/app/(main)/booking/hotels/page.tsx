// src/app/(main)/booking/hotels/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import { BedDouble, CalendarIcon, Search, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const hotelSearchSchema = z.object({
  destination: z.string().min(1, "Please enter a destination."),
  checkIn: z.date({
    required_error: "A check-in date is required.",
  }),
  checkOut: z.date({
    required_error: "A check-out date is required.",
  }),
  guests: z.string().min(1, "Please select the number of guests."),
}).refine(data => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOut"],
});


type HotelSearchFormValues = z.infer<typeof hotelSearchSchema>;

type HotelResult = {
  id: string;
  name: string;
  image: string;
  rating: number;
  pricePerNight: number;
};

const mockHotelResults: HotelResult[] = [
  {
    id: "1",
    name: "The Oberoi, Mumbai",
    image: "https://placehold.co/600x400.png",
    rating: 5,
    pricePerNight: 15000,
  },
  {
    id: "2",
    name: "Taj Mahal Palace, Mumbai",
    image: "https://placehold.co/600x400.png",
    rating: 5,
    pricePerNight: 18000,
  },
  {
    id: "3",
    name: "Trident, Nariman Point",
    image: "https://placehold.co/600x400.png",
    rating: 4.5,
    pricePerNight: 12000,
  },
];

export default function BookHotelsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelResult[]>([]);

  const form = useForm<HotelSearchFormValues>({
    resolver: zodResolver(hotelSearchSchema),
    defaultValues: {
      destination: "Mumbai",
      guests: "2",
      checkIn: new Date(),
      checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
  });

  function onSubmit(values: HotelSearchFormValues) {
    setIsLoading(true);
    setHotels([]);
    // Simulate API call
    setTimeout(() => {
      setHotels(mockHotelResults);
      setIsLoading(false);
    }, 1500);
  }
  
  const handleBooking = (hotelName: string) => {
    const { checkIn, checkOut, guests } = form.getValues();
    const checkinDate = format(checkIn, 'yyyy-MM-dd');
    const checkoutDate = format(checkOut, 'yyyy-MM-dd');
    
    const googleHotelsUrl = new URL('https://www.google.com/travel/hotels/search');
    googleHotelsUrl.searchParams.append('q', `${hotelName}, ${form.getValues('destination')}`);
    googleHotelsUrl.searchParams.append('checkin', checkinDate);
    googleHotelsUrl.searchParams.append('checkout', checkoutDate);
    googleHotelsUrl.searchParams.append('guests', guests);
    googleHotelsUrl.searchParams.append('hl', 'en'); // Language
    
    window.open(googleHotelsUrl.toString(), '_blank');
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
        } else if (i - 0.5 <= rating) {
            stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
        } else {
            stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />);
        }
    }
    return <div className="flex">{stars}</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <BedDouble className="h-8 w-8 text-primary" />
            Hotel Search
          </CardTitle>
          <CardDescription>
            Find the perfect place to stay for your next trip.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="checkIn"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-in</FormLabel>
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
                  name="checkOut"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check-out</FormLabel>
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
                              date < form.getValues("checkIn") ||
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
                name="guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guests</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[...Array(10)].map((_, i) => (
                          <SelectItem key={i + 1} value={`${i + 1}`}>
                            {i + 1} Guest{i > 0 && "s"}
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
                {isLoading ? "Searching..." : "Search Hotels"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || hotels.length > 0) && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Available Hotels</h2>
          <div className="grid md:grid-cols-1 gap-6">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <CardContent className="pt-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-5 w-1/2 mb-4" />
                        <Skeleton className="h-5 w-1/4" />
                    </CardContent>
                    <CardFooter>
                        <Skeleton className="h-10 w-full" />
                    </CardFooter>
                  </Card>
                ))
              : hotels.map((hotel) => (
                <Card key={hotel.id}>
                    <div className="relative h-48 w-full">
                        <Image
                            src={hotel.image}
                            alt={hotel.name}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-t-lg"
                            data-ai-hint="hotel exterior"
                        />
                    </div>
                    <CardHeader>
                        <CardTitle>{hotel.name}</CardTitle>
                        <div className="flex items-center gap-2">
                           {renderStars(hotel.rating)}
                           <span className="text-muted-foreground text-sm">({hotel.rating.toFixed(1)})</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-semibold">
                            ₹{hotel.pricePerNight.toLocaleString('en-IN')} / night
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => handleBooking(hotel.name)}>Book Now</Button>
                    </CardFooter>
                </Card>
                ))}
          </div>
        </div>
      )}
    </div>
  );
}
