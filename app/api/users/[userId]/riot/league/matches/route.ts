import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    // Step 1: Fetch the user's Riot PUUID from the database
    const user = await prisma.user.findUnique({
      where: { id: params.userId },
      select: { riotPUUID: true },
    });

    // Step 2: Check if the user exists and has a riotPUUID
    if (!user || !user.riotPUUID) {
      return NextResponse.json(
        { error: 'User not found or PUUID not available' },
        { status: 404 }
      );
    }

    // Step 3: Use the riotPUUID to fetch match IDs from the Riot API
    const response = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${user.riotPUUID}/ids?start=0&count=5`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY || '',
        },
      }
    );

    // Step 4: Check if the response is successful
    if (!response.ok) {
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: `Failed to fetch matches: ${errorData.message || 'No error message provided'}` },
          { status: response.status }
        );
      } else {
        const errorText = await response.text();
        return NextResponse.json(
          { error: `Failed to fetch matches: ${errorText || 'Unknown error'}` },
          { status: response.status }
        );
      }
    }

    // Step 5: Parse the response data
    const matchIds: string[] = await response.json();

    // Step 6: Return the match IDs
    return NextResponse.json(matchIds);
  } catch (error) {
    console.error('Error fetching match IDs:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch match IDs' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
