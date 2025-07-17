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
import { BedDouble, CalendarIcon, Search, Star, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { suggestHotels } from "@/ai/flows/suggest-hotels";
import { useToast } from "@/hooks/use-toast";

const hotelSearchSchema = z.object({
  destination: z.string().min(1, "Please enter a destination."),
  checkIn: z.date({
    required_error: "A check-in date is required.",
  }),
  checkOut: z.date({
    required_error: "A check-out date is required.",
  }),
  guests: z.string().min(1, "Please select the number of guests."),
  budget: z.coerce.number().positive("Budget must be a positive number.").optional(),
}).refine(data => data.checkOut > data.checkIn, {
    message: "Check-out date must be after check-in date.",
    path: ["checkOut"],
});


type HotelSearchFormValues = z.infer<typeof hotelSearchSchema>;

type HotelResult = {
  name: string;
  rating: number;
  pricePerNight: number;
};

export default function BookHotelsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [hotels, setHotels] = useState<HotelResult[]>([]);
  const { toast } = useToast();

  const form = useForm<HotelSearchFormValues>({
    resolver: zodResolver(hotelSearchSchema),
    defaultValues: {
      destination: "Mumbai",
      guests: "2",
      checkIn: new Date(),
      checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
    },
  });

  async function onSubmit(values: HotelSearchFormValues) {
    setIsLoading(true);
    setHotels([]);
    try {
        const result = await suggestHotels({ 
            destination: values.destination,
            budget: values.budget 
        });
        setHotels(result.hotels);
    } catch (error) {
        console.error("Failed to suggest hotels:", error);
        toast({
            title: "Error",
            description: "Could not fetch hotel suggestions. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }
  
  const handleBooking = (hotelName: string) => {
    const { checkIn, checkOut, guests, destination } = form.getValues();
    const checkinDate = format(checkIn, 'yyyy-MM-dd');
    const checkoutDate = format(checkOut, 'yyyy-MM-dd');
    
    const googleHotelsUrl = new URL('https://www.google.com/travel/hotels/search');
    googleHotelsUrl.searchParams.append('q', `${hotelName}, ${destination}`);
    googleHotelsUrl.searchParams.append('checkin', checkinDate);
    googleHotelsUrl.searchParams.append('checkout', checkoutDate);
    googleHotelsUrl.searchParams.append('guests', guests);
    googleHotelsUrl.searchParams.append('hl', 'en'); // Language
    
    window.open(googleHotelsUrl.toString(), '_blank');
  };

  const handleMoreOptionsClick = () => {
    const { checkIn, checkOut, guests, destination } = form.getValues();
    const checkinDate = format(checkIn, 'yyyy-MM-dd');
    const checkoutDate = format(checkOut, 'yyyy-MM-dd');

    const googleHotelsUrl = new URL('https://www.google.com/travel/hotels/search');
    googleHotelsUrl.searchParams.append('q', `Hotels in ${destination}`);
    googleHotelsUrl.searchParams.append('checkin', checkinDate);
    googleHotelsUrl.searchParams.append('checkout', checkoutDate);
    googleHotelsUrl.searchParams.append('guests', guests);
    googleHotelsUrl.searchParams.append('hl', 'en');
    
    window.open(googleHotelsUrl.toString(), '_blank');
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
        stars.push(<Star key={`full-${i}`} className="h-5 w-5 fill-yellow-400 text-yellow-400" />);
    }
    if (halfStar) {
        stars.push(<Star key="half" className="h-5 w-5 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
    }
    for (let i = 0; i < emptyStars; i++) {
        stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }
    return <div className="flex">{stars}</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-8">
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

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Budget per Night (INR)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 8000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                <Search className="mr-2 h-4 w-4" />{" "}
                {isLoading ? "Searching..." : "Search Hotels"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {(isLoading || hotels.length > 0) && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Hotels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <Card key={hotel.name}>
                    <div className="relative h-48 w-full">
                        <Image
                            src={`https://placehold.co/600x400.png`}
                            alt={hotel.name}
                            fill
                            style={{objectFit: "cover"}}
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
          {!isLoading && hotels.length > 0 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleMoreOptionsClick}
            >
              View More Hotels on Google
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
