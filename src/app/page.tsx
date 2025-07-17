// src/app/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Bot, CalendarCheck, MapPin } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Bot className="h-10 w-10" />,
    title: "AI-Powered Suggestions",
    description: "Describe your dream trip, and our AI will suggest personalized destinations, itineraries, and activities just for you.",
  },
  {
    icon: <CalendarCheck className="h-10 w-10" />,
    title: "Complete Itinerary Planning",
    description: "Go from idea to detailed daily plan in minutes. Customize activities, find restaurants, and generate a pre-trip checklist.",
  },
  {
    icon: <MapPin className="h-10 w-10" />,
    title: "All-in-One Trip Management",
    description: "Book flights and hotels, save your favorite trips, and keep all your travel plans neatly organized in one place.",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    avatar: "PS",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    title: "Best Travel Planner Ever!",
    description: "RoamReady made planning our family trip to Kerala so easy. The AI suggestions were spot on, and the itinerary was perfect!",
  },
  {
    name: "Rohan M.",
    avatar: "RM",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    title: "A Must-Have for Solo Travelers",
    description: "As a solo traveler, I loved the personalized checklist and restaurant suggestions. It felt like I had a local guide with me.",
  },
  {
    name: "Anjali K.",
    avatar: "AK",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026706d",
    title: "Saved Me Hours of Research",
    description: "I used to spend weeks planning trips. With RoamReady, I planned my entire Europe tour in a single afternoon. Incredible!",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your Perfect Trip, <span className="text-primary">Planned by AI</span>
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Stop researching, start exploring. RoamReady is the smart travel planner that creates personalized itineraries and helps you discover your next adventure.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link href="/destinations">
                Plan Your Trip Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
            How It Works
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Planning your next journey is as simple as 1-2-3.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="flex flex-col items-center p-6 text-center">
              <div className="mb-4 text-primary">{feature.icon}</div>
              <h3 className="mb-2 text-2xl font-bold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-8 md:py-12 lg:py-24">
        <div className="container">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
             <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Loved by Travelers
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              See what fellow explorers are saying about their RoamReady experience.
            </p>
          </div>
          <div className="mx-auto grid grid-cols-1 gap-8 pt-10 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold">{testimonial.title}</p>
                  <p className="mt-2 text-muted-foreground">"{testimonial.description}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="bg-secondary py-16">
        <div className="container flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold md:text-4xl">Ready to Start Your Adventure?</h2>
          <p className="mt-4 max-w-2xl text-lg text-secondary-foreground">
            Your next unforgettable trip is just a few clicks away. Let our AI be your guide.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/destinations">
              Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
