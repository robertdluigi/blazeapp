"use client";

import InfiniteScroll from "@/components/InfiniteScroll";
import kyInstance from "@/lib/ky";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";

interface Match {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info?: {
    gameCreation: number;
    gameDuration: number;
    gameId: number;
    gameMode: string;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participants: any[];
    teams: any[];
  };
}

interface MatchesPageData {
  matches: Match[];
  nextCursor: string | null;
}

interface UserMatchesProps {
  summonerName: string;
}

export default function UserMatches({ summonerName }: UserMatchesProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["matches", summonerName],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(`/api/matches/${summonerName}`, {
          searchParams: pageParam ? { cursor: pageParam } : {},
        })
        .json<MatchesPageData>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const matches = data?.pages.flatMap((page) => page.matches) || [];

  if (status === "pending") {
    return <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>;
  }

  if (status === "success" && !matches.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No matches found for this summoner.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading matches.
      </p>
    );
  }

  return (
    <InfiniteScroll
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {matches.map((match, index) => (
        <div key={match.metadata?.matchId || index} className="match-item">
          {match.metadata ? (
            <>
              <h2 className="font-bold">Match ID: {match.metadata.matchId}</h2>
              {match.info ? (
                <>
                  <p>Game Mode: {match.info.gameMode}</p>
                  <p>Duration: {Math.floor(match.info.gameDuration / 60)} minutes</p>
                </>
              ) : (
                <p>Game information not available</p>
              )}
              <p>Participants:</p>
              <ul className="list-disc pl-5">
                {match.metadata.participants.map((participant, index) => (
                  <li key={index}>{participant}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>Match metadata not available</p>
          )}
        </div>
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScroll>
  );
}
