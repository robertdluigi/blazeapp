// src/lib/prisma/participantService.ts



import prisma from "./prisma";

export const getParticipantsByLobbyId = async (lobbyId: string) => {
    const participants = await prisma.participant.findMany({
      where: {
        lobbyId,
      },
      select: {
        user: {
          select: {
            username: true, // Fetch the username from the related User model
          },
        },
      },
    });
  
    // Map and return just the usernames
    return participants.map((participant) => participant.user.username);
  };