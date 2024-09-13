import { NextRequest, NextResponse } from 'next/server';
import { generateSteamLinkUrl } from '@/lib/steam';
import { validateRequest } from "@/auth";

export async function GET(req: NextRequest) {
  const { user } = await validateRequest();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const linkUrl = generateSteamLinkUrl();
  return NextResponse.redirect(linkUrl);
}