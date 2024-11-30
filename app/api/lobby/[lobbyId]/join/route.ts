import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateRequest } from "@/auth";

export async function POST(req: Request, { params }: { params: { lobbyId: string } }) {
  const { lobbyId } = params; // Extract lobbyId from the route
  const currentUser = await validateRequest();
  const currentUserId = currentUser.user?.id;

  // Ensure the user is authenticated and currentUserId is defined
  if (!currentUserId) {
    return new NextResponse('User is not authenticated', { status: 401 });
  }

  if (!lobbyId) {
    return new NextResponse('Lobby ID is required', { status: 400 });
  }

  // Check if the user is already in the lobby
  const existingParticipant = await prisma.participant.findFirst({
    where: {
      lobbyId,
      userId: currentUserId, // Ensure the user is not already a participant
    },
  });

  if (existingParticipant) {
    return new NextResponse('Already in the lobby', { status: 400 });
  }

  // Add the user as a participant in the lobby
  await prisma.participant.create({
    data: {
      lobbyId,
      userId: currentUserId, // `currentUserId` is now guaranteed to be a string
    },
  });

  // Update the user current-lobby-id
  await prisma.user.update({
    where: { id: currentUserId },
    data: { currentLobbyId: lobbyId }, // Set the currentLobbyId for the user
  });
  // Send a response back
  return new NextResponse('User successfully joined the lobby', { status: 200 });
}
