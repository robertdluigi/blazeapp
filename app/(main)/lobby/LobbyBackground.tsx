// LobbyBackground.tsx
"use client";
import { BackgroundBeamsWithCollision } from "@/components/ui/BackgroundBeams";
import { cn } from "@/lib/utils";
import React from "react";

interface LobbyBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

const LobbyBackground: React.FC<LobbyBackgroundProps> = ({
  children,
  className,
}) => {
  return (
    <BackgroundBeamsWithCollision className={className}>
      {children}
    </BackgroundBeamsWithCollision>
  );
};

export default LobbyBackground;
