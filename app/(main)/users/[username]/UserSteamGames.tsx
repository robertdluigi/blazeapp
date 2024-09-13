"use client";

import { useQuery } from "@tanstack/react-query";
import ky from "@/lib/ky";
import { Loader2 } from "lucide-react";
import type { SteamGame } from '@/types/steam';
import Image from "next/image";
import { formatPlaytime } from "@/lib/utils";

interface UserGamesProps {
    userId: string;
}

export default function UserSteamGames({ userId }: UserGamesProps) {
    const { data, isFetching, status } = useQuery({
        queryKey: ["user-games", userId],
        queryFn: () =>
            ky
                .get(`/api/users/${userId}/games/steam`)
                .json<{ games: SteamGame[] }>(), // Update the type to match the response structure
    });

    console.log("Data:", data);
    console.log("Games:", data?.games);

    // Access the games from the response
    const games = data?.games || [];

    if (isFetching) {
        return <Loader2 className="mx-auto my-3 animate-spin" />;
    }

    if (status === "success" && games.length === 0) {
        return (
            <p className="text-center text-muted-foreground">
                This user hasn&apos;t played any games yet.
            </p>
        );
    }

    if (status === "error") {
        return (
            <p className="text-center text-destructive">
                An error occurred while loading games.
            </p>
        );
    }

    return (
        <div className="space-y-5">
            {games.map((game) => (
                
                <div key={game.appid} className="flex items-center space-x-4 p-4 border-b">
                    <Image
                        src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_231x87.jpg` || '/default-game-image.png'}
                        alt={game.name || `Game ${game.appid}`}
                        className="w-48 h-16 object-cover"
                        width={256}
                        height={256}
                    />
                    <div className="flex-1">
                        <p className="text-lg font-semibold">{game.name || `Game ID: ${game.appid}`}</p>
                        <p className="text-sm text-muted-foreground">
                            Playtime: {formatPlaytime(game.playtime_forever)}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
