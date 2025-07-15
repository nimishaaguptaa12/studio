// src/app/(main)/booking/flights/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plane, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function BookFlightsPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <Plane className="h-8 w-8 text-primary" />
            Book Your Flights
          </CardTitle>
          <CardDescription>
            Find the best deals on flights for your next adventure. We partner
            with Google Flights to bring you the best options.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Image
            src="https://placehold.co/800x400.png/E2E8F0/E2E8F0"
            data-ai-hint="airplane travel"
            alt="Airplane flying over clouds"
            width={800}
            height={400}
            className="rounded-lg object-cover"
          />
        </CardContent>
        <CardFooter>
          <Button asChild size="lg">
            <Link
              href="https://www.google.com/flights"
              target="_blank"
              rel="noopener noreferrer"
            >
              Search on Google Flights
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}