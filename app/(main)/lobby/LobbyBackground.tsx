// LobbyBackground.tsx
"use client";
import { BackgroundBeamsWithCollision } from "@/components/ui/BackgroundBeams";
import { cn } from "@/lib/utils";
import React from "react";

interface LobbyBackgroundProps {
  className?: string;
}

const LobbyBackground: React.FC<LobbyBackgroundProps> = ({
  className,
}) => {
  return (
    <BackgroundBeamsWithCollision className={className}>
    </BackgroundBeamsWithCollision>
  );
};

export default LobbyBackground;
