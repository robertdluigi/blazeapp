import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateRequest } from "@/auth";
import { revalidatePath } from 'next/cache';

// This map will store active SSE connections for each lobby
const sseConnections: Map<string, Array<ReadableStreamDefaultController>> = new Map();

export async function POST(req: Request, { params }: { params: { lobbyId: string } }) {
  const { lobbyId } = params; // Extract lobbyId from the route
  const currentUser = await validateRequest();
  const currentUserId = currentUser.user?.id;

  // Ensure the user is authenticated
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

  // Update the user current-lobby-id
  await prisma.user.update({
    where: { id: currentUserId },
    data: { currentLobbyId: lobbyId }, // Set the currentLobbyId for the user
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

  

  // Send a response back to the client
  return new NextResponse('User successfully joined the lobby', { status: 200 });
}

// GET route for establishing SSE connection (unchanged)
export async function GET(req: Request, { params }: { params: { lobbyId: string } }) {
  const { lobbyId } = params;
  const currentUser = await validateRequest();
  const currentUserId = currentUser.user?.id;

  if (!lobbyId) {
    return new NextResponse('Lobby ID is required', { status: 400 });
  }

  // Set headers for SSE
  const headers = new Headers();
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Connection', 'keep-alive');
  headers.set('Transfer-Encoding', 'chunked');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET');
  headers.set('Content-Ecoding', 'none');
  let currentController: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(controller) {
      currentController = controller;

      // Store this connection for the lobby
      if (!sseConnections.has(lobbyId)) {
        sseConnections.set(lobbyId, []);
      }
      sseConnections.get(lobbyId)?.push(controller);

      req.signal.addEventListener('abort', () => {
        // Remove this connection from the lobby's list of active SSE connections
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
