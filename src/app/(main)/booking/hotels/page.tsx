// src/app/(main)/booking/hotels/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BedDouble } from "lucide-react";

export default function BookHotelsPage() {
  return (
    <div className="container mx-auto max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
            <BedDouble className="h-8 w-8 text-primary" />
            Book Your Hotel
          </CardTitle>
          <CardDescription>
            Find the perfect place to stay for your trip. Powered by Google
            Travel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border">
            <iframe
              src="https://www.google.com/travel/hotels"
              title="Google Hotels"
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
