// app/api/users/[userId]/riot/league/champion-stats/[championId]/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { userId: string, championId: string } }) {
  try {
    // Fetch the champion stats from Riot API or internal service
    const statsResponse = await fetch(
      `https://riot-api-endpoint.com/champion-stats/${params.championId}`, 
      {
        method: 'GET',
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY || '', // Add your Riot API key in .env file
        },
      }
    );

    if (!statsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch champion stats' }, { status: statsResponse.status });
    }

    const statsData = await statsResponse.json();

    // Return win rate and other champion stats
    return NextResponse.json({
      winRate: statsData.winRate, // Assuming the API returns winRate
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
