'use server';

import prisma from '@/lib/prisma';
import { Lobby, User } from '@prisma/client';
import { CreateLobbyInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';

// Define the lobby creation action
export async function createLobby(input: CreateLobbyInput): Promise<Lobby> {
  const { userId, gameTitle, gameMode, maxPlayers, inviteCode } = input;

  if (!gameTitle) {
    throw new Error('Game title is required');
  }
  if (!gameMode) {
    throw new Error('Game mode is required');
  }
  if (!maxPlayers) {
    throw new Error('Max players is required');
  }

  try {
    // Create the new lobby
    const newLobby = await prisma.lobby.create({
      data: {
        userId,
        gameTitle,
        gameMode,
        maxPlayers,
        inviteCode,
        createdAt: new Date(),
        participants: {
          create: {
            userId: userId, // Set the userId of the creator as the participant
          },
        },
      },
    });

    // Optionally, update the user's currentLobbyId to point to the newly created lobby
    await prisma.user.update({
      where: { id: userId },
      data: { currentLobbyId: newLobby.id }, // Set the currentLobbyId for the user
    });
    revalidatePath('/lobby');
    return newLobby; // Return the created lobby
  } catch (error) {
    console.error('Error creating lobby:', error);
    throw new Error('Failed to create lobby');
  }
}

// Function to fetch current lobby ID for the user
export async function fetchCurrentLobbyId(userId: string): Promise<string | null> {
  if (!userId) {
    throw new Error('User ID is required');
  }

  try {
    const user: Pick<User, 'currentLobbyId'> | null = await prisma.user.findUnique({
      where: { id: userId },
      select: { currentLobbyId: true },
    });

    return user?.currentLobbyId || null; // Return the currentLobbyId or null if not set
  } catch (error) {
    console.error('Error fetching current lobby ID:', error);
    throw new Error('Failed to fetch current lobby ID');
  }
}
