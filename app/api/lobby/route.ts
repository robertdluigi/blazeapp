// /app/api/lobby/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Import Prisma client

export async function GET(request: Request) {
  // Extract search params from the request URL
  const { searchParams } = new URL(request.url);
  const lobbyId = searchParams.get('lobbyId'); // Get 'lobbyId' from search params

  if (!lobbyId) {
    return NextResponse.json({ error: 'Lobby ID is required' }, { status: 400 });
  }

  try {
    // Fetch lobby details from the database using Prisma
    const lobbyDetails = await prisma.lobby.findUnique({
      where: { id: lobbyId }, // Assuming 'id' is the field in your Lobby model
    });

    if (!lobbyDetails) {
      return NextResponse.json({ error: 'Lobby not found' }, { status: 404 });
    }

    return NextResponse.json(lobbyDetails); // Return the lobby details as a JSON response
  } catch (error) {
    console.error('Error fetching lobby details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
