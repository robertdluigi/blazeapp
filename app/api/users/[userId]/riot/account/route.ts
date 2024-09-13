import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { RiotAccountData } from '@/types/riot'; // Import the RiotAccountData interface

export async function GET(
  req: NextRequest,
  { params: { userId } }: { params: { userId: string } }
) {
  try {
    // Step 1: Fetch the user's Riot PUUID from the database
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { riotPUUID: true }, // Fetch the riotPUUID instead of the access token
    });

    // Step 2: Check if the user exists and has a riotPUUID
    if (!user || !user.riotPUUID) {
      return NextResponse.json(
        { error: 'User not found or PUUID not available' },
        { status: 404 }
      );
    }

    // Step 3: Use the riotPUUID to fetch Riot account data from the Riot API
    const response = await fetch(`https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/${user.riotPUUID}`, {
      headers: {
        'X-Riot-Token': process.env.RIOT_API_KEY || '', // Use an environment variable to securely store the Riot API key
      },
    });

    // Step 4: Log response status and headers for debugging
    console.log(`Response Status: ${response.status}`);
    console.log('Response Headers:', [...response.headers.entries()]);

    // Step 5: Check if the response is successful
    if (!response.ok) {
      const contentType = response.headers.get('content-type');

      // Step 5a: Handle JSON response errors
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        return NextResponse.json(
          { error: `Failed to fetch data from Riot Games API: ${errorData.message || 'No error message provided'}` },
          { status: response.status }
        );
      } else {
        // Step 5b: Handle non-JSON response errors
        const errorText = await response.text();
        return NextResponse.json(
          { error: `Failed to fetch data from Riot Games API: ${errorText || 'Unknown error'}` },
          { status: response.status }
        );
      }
    }

    // Step 6: Parse the response data
    const data: RiotAccountData = await response.json();

    // Step 7: Return the Riot Games API response
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Riot account data:', error);

    // Step 8: Type guard to narrow down the error type
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch data from Riot Games API' },
        { status: 500 }
      );
    }

    // Step 9: Handle non-standard error cases
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
