import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string, userPUUID: string } }
) {

  const { searchParams } = new URL(req.url);
  const championId = searchParams.get('championId');
  try {

    // Step 2: Check if the user exists and has a riotPUUID
    if (!params.userPUUID) {
      return NextResponse.json(
        { error: 'User not found or PUUID not available' },
        { status: 404 }
      );
    }

    // Step 3: Fetch champion mastery data from the Riot API using the provided userPUUID
    const masteryResponse = await fetch(
      `https://eun1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${params.userPUUID}/by-champion/${championId}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY || '',
        },
      }
    );

    // Step 4: Check if the response is successful
    if (!masteryResponse.ok) {
      const contentType = masteryResponse.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        const errorData = await masteryResponse.json();
        return NextResponse.json(
          { error: `Failed to fetch champion mastery: ${errorData.message || 'No error message provided'}` },
          { status: masteryResponse.status }
        );
      } else {
        const errorText = await masteryResponse.text();
        return NextResponse.json(
          { error: `Failed to fetch champion mastery: ${errorText || 'Unknown error'}` },
          { status: masteryResponse.status }
        );
      }
    }

    // Step 5: Parse the response data
    const championMasteryData = await masteryResponse.json();

    // Step 6: Return the champion mastery data
    return NextResponse.json(championMasteryData);
  } catch (error) {
    console.error('Error fetching champion mastery:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to fetch champion mastery' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
