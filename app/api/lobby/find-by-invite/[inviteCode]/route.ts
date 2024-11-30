import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { inviteCode: string } }) {
  const { inviteCode } = params;

  if (!inviteCode) {
    return new NextResponse('Invite code is required', { status: 400 });
  }

  // Find the lobby by invite code
  const lobby = await prisma.lobby.findUnique({
    where: { inviteCode },
    select: { id: true },
  });

  if (!lobby) {
    return new NextResponse('Lobby not found for this invite code', { status: 404 });
  }

  // Return the lobbyId
  return NextResponse.json({ lobbyId: lobby.id });
}
