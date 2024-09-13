"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "@/lib/ky";
import { Loader2 } from "lucide-react";
import type { RiotAccountData } from "@/types/riot";

interface UserRiotDataProps {
  userId: string;
}

export default function UserRiotData({ userId }: UserRiotDataProps) {
  const { data, isFetching, status } = useQuery({
    queryKey: ["user-riot-data", userId],
    queryFn: () =>
      ky
        .get(`/api/users/${userId}/riot/account`)
        .json<RiotAccountData>(),
  });

  if (isFetching) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  if (status === "success" && !data) {
    return <span className="text-muted-foreground">Not connected</span>;
  }

  if (status === "error") {
    return <span className="text-destructive">Error loading Riot data</span>;
  }

  return data ? (
    <span className="text-sm text-gray-500">
      {data.gameName}#{data.tagLine}
    </span>
  ) : null;
}
