import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateRequest } from "@/auth";

// This map will store active SSE connections for each lobby
const sseConnections: Map<string, Array<ReadableStreamDefaultController>> = new Map();

export const config = {
  runtime: 'edge', // Use Edge Runtime for better streaming support
};

export async function POST(req: Request, { params }: { params: { lobbyId: string } }) {
  const { lobbyId } = params; // Extract lobbyId from the route
  const currentUser = await validateRequest();
  const currentUserId = currentUser.user?.id;

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
      userId: currentUserId,
    },
  });

  if (existingParticipant) {
    return new NextResponse('Already in the lobby', { status: 400 });
  }

  // Add the user as a participant in the lobby
  await prisma.participant.create({
    data: {
      lobbyId,
      userId: currentUserId,
    },
  });

  // Update the user's current lobby ID
  await prisma.user.update({
    where: { id: currentUserId },
    data: { currentLobbyId: lobbyId },
  });

  // Fetch the new participant details
  const participant = await prisma.user.findUnique({
    where: { id: currentUserId },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  });

  // Send the event to all connected clients in the lobby
  const eventData = {
    type: 'participant-joined',
    participant: {
      username: participant?.username,
      displayName: participant?.displayName,
      avatarUrl: participant?.avatarUrl,
    },
  };

  // Broadcast to all clients connected to this lobby
  sseConnections.get(lobbyId)?.forEach(controller => {
    controller.enqueue(`data: ${JSON.stringify(eventData)}\n\n`);
  });

  return new NextResponse('User successfully joined the lobby', { status: 200 });
}

export async function GET(req: Request, { params }: { params: { lobbyId: string } }) {
  const { lobbyId } = params;
  const currentUser = await validateRequest();
  const currentUserId = currentUser.user?.id;

  if (!lobbyId) {
    return new NextResponse('Lobby ID is required', { status: 400 });
  }

  // Set headers for SSE
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*', // Adjust based on your CORS policy
  });

  let currentController: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(controller) {
      currentController = controller;

      // Store this connection for the lobby
      if (!sseConnections.has(lobbyId)) {
        sseConnections.set(lobbyId, []);
      }
      sseConnections.get(lobbyId)?.push(controller);

      // Handle request abortion
      req.signal.addEventListener('abort', () => {
        const connections = sseConnections.get(lobbyId);
        if (connections) {
          const index = connections.indexOf(controller);
          if (index !== -1) {
            connections.splice(index, 1);
          }
        }
        controller.close();
      });
    },
  });

  return new NextResponse(stream, { headers });
}
