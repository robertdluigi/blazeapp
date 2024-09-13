// app/api/steam/account/route.ts

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust path as necessary
import kyInstance from '@/lib/ky';

// Define TypeScript interfaces for the Steam API response
interface SteamPlayer {
    steamid: string;
    personaname: string;
    avatar: string;
    [key: string]: any;
}

interface SteamResponse {
    response: {
        players: SteamPlayer[];
    };
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const fields = searchParams.get('fields');

    if (!userId) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        // Fetch user data from your database
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { steamId: true }
        });

        if (!user || !user.steamId) {
            return NextResponse.json({ error: 'Steam ID not found for this user' }, { status: 404 });
        }

        // Fetch Steam user data
        const steamResponse = await kyInstance.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_CLIENT_ID}&steamids=${user.steamId}`).json<SteamResponse>();

        if (steamResponse.response.players.length > 0) {
            const playerData = steamResponse.response.players[0];
            let responseData: Record<string, any> = {};

            if (fields) {
                const requestedFields = fields.split(',');
                requestedFields.forEach(field => {
                    if (playerData[field]) {
                        responseData[field] = playerData[field];
                    }
                });
            } else {
                responseData = playerData; // Return all data if no specific fields are requested
            }

            return NextResponse.json(responseData);
        } else {
            return NextResponse.json({ error: 'Steam player not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
