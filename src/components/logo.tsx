// src/components/logo.tsx
import { Compass } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <Compass className="h-8 w-8 text-primary" />
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        RoamReady
      </h1>
    </div>
  );
};
