// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "RoamReady - Your AI Travel Planner",
  description: "Plan your next adventure with AI-powered suggestions and tools.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn("min-h-screen bg-background font-body antialiased", inter.variable)}
        suppressHydrationWarning={true}
      >
        <div className="flex min-h-screen flex-col">
           {/* This header is for the landing page */}
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center">
              <div className="mr-4 hidden md:flex">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                  <Logo />
                </Link>
              </div>
              <div className="flex flex-1 items-center justify-end space-x-2">
                 {/* This button will be visible on the landing page, but the layout might be used by other pages too */}
                <Button asChild>
                    <Link href="/destinations">Get Started</Link>
                </Button>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="bg-secondary">
            <div className="container py-8 text-center text-secondary-foreground">
              <p>&copy; {new Date().getFullYear()} RoamReady. All rights reserved.</p>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
