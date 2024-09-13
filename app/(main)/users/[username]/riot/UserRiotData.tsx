"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "@/lib/ky";
import { Loader2 } from "lucide-react";
import { formatDate } from "date-fns";
import { twMerge } from "tailwind-merge";
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

  console.log("Data:", data);

  if (isFetching) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  if (status === "success" && !data) {
    return (
      <p className="text-center text-muted-foreground">
        No Riot account data found for this user.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading Riot account data.
      </p>
    );
  }

  // Only render RiotCard if data is not undefined
  return (
    data && (
      <div className="flex w-full min-w-0 gap-5 justify-center">
        <div className="w-full min-w-0 max-w-xl">
          <RiotCard riotData={data} />
        </div>
      </div>
    )
  );
}

interface RiotCardProps {
  riotData: RiotAccountData;
}

function RiotCard({ riotData }: RiotCardProps) {
  const bannerColor = "#1F2937"; // Default banner color
  const cardPrimaryColor = "#000"; // Default card primary color
  const cardSecondaryColor = "#FFF"; // Default card secondary color

  return (
    <div
      className="relative p-0 rounded-2xl"
      style={{
        background: `linear-gradient(to bottom, ${cardPrimaryColor}, ${cardSecondaryColor})`,
        borderImage: `linear-gradient(to bottom, ${cardPrimaryColor}, ${cardSecondaryColor}) 0`,
      }}
    >
      <div className="h-fit w-full rounded-2xl overflow-hidden shadow-lg">
        <div
          className={twMerge("p-8 flex items-center space-x-4")}
          style={{
            backgroundColor: bannerColor,
            backgroundImage: `url(/path/to/riot-banner.jpg)`, // Placeholder or use a dynamic URL if needed
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {riotData.gameName} ({riotData.tagLine})
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              PUUID: {riotData.puuid}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Last Updated: {formatDate(new Date(), "MMM yyyy")}
            </div>
          </div>
        </div>

        <hr
          className="border-t-2 border-gray-300 dark:border-gray-700"
          style={{
            borderImage: `linear-gradient(to left, ${cardPrimaryColor}, ${cardSecondaryColor}) 1`,
          }}
        />

        <div className={twMerge("p-8 space-y-6")}>
          <div>
            <h3 className="text-sm font-semibold text-gray-300">
              Summoner Details
            </h3>
            <ul className="space-y-2 mt-2 text-sm text-gray-300">
              <li>
                <strong>PUUID:</strong> {riotData.puuid}
              </li>
              <li>
                <strong>Game Name:</strong> {riotData.gameName}
              </li>
              <li>
                <strong>Tag Line:</strong> {riotData.tagLine}
              </li>
            </ul>
          </div>

          {/* Additional sections like match history can be added here if required */}
        </div>
      </div>
    </div>
  );
}
