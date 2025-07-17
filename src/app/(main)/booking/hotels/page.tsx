// src/app/(main)/booking/hotels/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BedDouble, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function BookHotelsPage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <BedDouble className="h-8 w-8 text-primary" />
            Book Your Hotel
          </CardTitle>
          <CardDescription>
            Find the perfect place to stay for your trip. We partner with
            Google Travel to help you find the best accommodations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Image removed as per request */}
        </CardContent>
        <CardFooter>
          <Button asChild size="lg">
            <Link
              href="https://www.google.com/travel/hotels"
              target="_blank"
              rel="noopener noreferrer"
            >
              Search on Google Hotels
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}