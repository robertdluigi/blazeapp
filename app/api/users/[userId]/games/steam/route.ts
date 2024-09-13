import { NextRequest } from "next/server";
import { validateRequest } from "@/auth";
import prisma from '@/lib/prisma'; // Adjust the path as necessary
import ky from 'ky';
import type { SteamGamesResponse } from '@/types/steam'; // Import the type

export async function GET(
    req: NextRequest,
    { params: { userId } }: { params: { userId: string } },
) {
    try {
        // Validate the request and get the authenticated user
        const { user } = await validateRequest();

        // Fetch the user's Steam ID from the database
        const userDb = await prisma.user.findUnique({
            where: { id: userId as string },
            select: { steamId: true }
        });

        // Check if the user has a Steam ID
        if (!userDb || !userDb.steamId) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Fetch games data from the Steam API
        const steamApiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_CLIENT_ID}&steamid=${userDb.steamId}&include_played_free=true&include_appinfo=true`;
        const steamResponse = await ky.get(steamApiUrl).json<SteamGamesResponse>();

        // Log the raw response for debugging purposes
        console.log("Steam API Response:", steamResponse);

        // Extract and sanitize the games data
        const userGames = steamResponse.response?.games ?? [];

        const sanitizedGames = userGames.map(game => ({
            appid: game.appid,
            name: game.name || `Unknown Game (${game.appid})`, // Handle missing game names
            playtime_forever: game.playtime_forever,
            imgUrl: game.imgUrl || `/steam/game/${game.appid}/image` // Provide default image URL if missing
        }));

        // Return the sanitized games data
        return new Response(JSON.stringify({ games: sanitizedGames }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching Steam games:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
