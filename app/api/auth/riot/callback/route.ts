import { NextRequest, NextResponse } from 'next/server';
import { tokenUrl, clientID, clientSecret, appCallbackUrl } from '@/lib/riot';
import { validateRequest } from "@/auth";
import prisma from '@/lib/prisma';
import ky from 'ky'; // Assuming you're using ky for HTTP requests

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    // Step 1: Exchange the authorization code for tokens
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${clientID}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: appCallbackUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data }, { status: response.status });
    }

    console.log('Riot API Token Exchange Response:', data);

    const { access_token, refresh_token } = data;

    if (!access_token || !refresh_token) {
      return NextResponse.json({ error: 'Access token or refresh token not found in the response' }, { status: 400 });
    }

    // Step 2: Fetch the user's account information directly from the Europe cluster
    const accountResponse = await ky.get('https://europe.api.riotgames.com/riot/account/v1/accounts/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    }).json<{ puuid: string, gameName: string, tagLine: string }>();

    console.log('Account Information Response:', accountResponse);

    if (!accountResponse.puuid) {
      return NextResponse.json({ error: 'Failed to retrieve Riot account information' }, { status: 500 });
    }

    // Step 3: Update the user's tokens and PUUID in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        riotAccessToken: access_token,
        riotRefreshToken: refresh_token,
        riotPUUID: accountResponse.puuid,
      },
    });

    // Step 4: Redirect to the success page
    return NextResponse.redirect(new URL(`${process.env.APP_BASE_URL || "https://local.example.com"}/settings/success`, req.url));
  } catch (error) {
    console.error('Riot OAuth callback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
