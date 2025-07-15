// src/app/(main)/booking/flights/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plane } from "lucide-react";

export default function BookFlightsPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <Plane className="h-8 w-8 text-primary" />
            Book Your Flights
          </CardTitle>
          <CardDescription>
            Find the best deals on flights for your next adventure. Powered by
            Google Flights.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border">
            <iframe
              src="https://www.google.com/flights"
              title="Google Flights"
              className="h-full w-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer"
            ></iframe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
