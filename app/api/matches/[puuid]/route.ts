import { NextRequest, NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.RIOT_API_KEY;
const RIOT_API_BASE_URL = 'https://eun1.api.riotgames.com';
const RIOT_API_REGION_URL = 'https://europe.api.riotgames.com';

export async function GET(
  request: NextRequest,
  { params: { puuid } }: { params: { puuid: string } }
) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');


  try {
    // Fetch summoner data
    const summonerResponse = await fetch(`${RIOT_API_BASE_URL}/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY!,
      },
    });

    if (!summonerResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch summoner data' }, { status: summonerResponse.status });
    }

    const summonerData = await summonerResponse.json();
    
    // Fetch match IDs
    const matchIdsResponse = await fetch(`${RIOT_API_REGION_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?${cursor ? `start=${cursor}` : ''}`, {
      headers: {
        'X-Riot-Token': RIOT_API_KEY!,
      },
    });

    if (!matchIdsResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch match IDs' }, { status: matchIdsResponse.status });
    }

    const matchIds = await matchIdsResponse.json();

    // Fetch match details for each match ID
    const matchDetailsPromises = matchIds.map((matchId: string) =>
      fetch(`${RIOT_API_REGION_URL}/lol/match/v5/matches/${matchId}`, {
        headers: {
          'X-Riot-Token': RIOT_API_KEY!,
        },
      }).then((res) => res.json())
    );

    const matches = await Promise.all(matchDetailsPromises);

    return NextResponse.json({
      matches,
      nextCursor: matchIds.length < 100 ? null : cursor ? parseInt(cursor) + 100 : 100,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
