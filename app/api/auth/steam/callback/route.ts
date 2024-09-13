import { NextRequest, NextResponse } from 'next/server';
import { validateSteamResponse, extractSteamId } from '@/lib/steam';
import { validateRequest } from "@/auth";
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams.entries());

    console.log('Received callback parameters:', params);

    if (params['openid.mode'] === 'error') {
      console.error('OpenID error:', params['openid.error']);
      return NextResponse.json({ error: 'Steam linking failed', details: params }, { status: 400 });
    }

    const isValid = await validateSteamResponse(params);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Steam response' }, { status: 400 });
    }

    const steamId = extractSteamId(params);
    if (!steamId) {
      return NextResponse.json({ error: 'Failed to extract Steam ID' }, { status: 400 });
    }

    // Check if the Steam ID is already linked to a user
    const existingUser = await prisma.user.findUnique({
      where: { steamId },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'This Steam account is already linked to another user.' }, { status: 400 });
    }

    // Link the Steam ID to the authenticated user
    await prisma.user.update({
      where: { id: user.id },
      data: { steamId },
    });

    // Redirect to the profile page or any other page
    return NextResponse.redirect(new URL('/settings/success', req.url));
  } catch (error) {
    console.error('Steam linking error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}