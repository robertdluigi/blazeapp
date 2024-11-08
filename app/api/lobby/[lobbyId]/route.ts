import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Adjust the path to your Prisma client

export async function GET(req: NextRequest, { params }: { params: { lobbyId: string } }) {
  const { lobbyId } = params;

  if (!lobbyId) {
    return NextResponse.json({ error: 'Lobby ID is required' }, { status: 400 });
  }

  try {
    // Fetch participants directly from the database using Prisma
    const participants = await prisma.participant.findMany({
      where: {
        lobbyId,
      },
      select: {
        user: {
          select: {
            username: true, // Fetch the username from the related User model
            avatarUrl: true,
            bannerColor: true,
            bannerUrl: true,
            displayName: true,
          },
        },
      },
    });

    // Map to create an array of participant details
    const participantDetails = participants.map((participant) => ({
      username: participant.user.username,
      avatarUrl: participant.user.avatarUrl,
      bannerColor: participant.user.bannerColor,
      bannerUrl: participant.user.bannerUrl,
      displayName: participant.user.displayName,
    }));

    return NextResponse.json({ participants: participantDetails }, { status: 200 });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ error: 'Failed to fetch participants' }, { status: 500 });
  }
}
