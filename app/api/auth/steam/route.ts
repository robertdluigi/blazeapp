import { NextRequest, NextResponse } from 'next/server';
import { steamClient } from '@/lib/steam';

export async function GET(req: NextRequest) {
  const authorizationUrl = steamClient.authorizationUrl();
  return NextResponse.redirect(authorizationUrl);
}