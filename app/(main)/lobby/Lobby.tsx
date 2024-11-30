'use client';

import React, { useEffect, useState } from 'react';
import LobbyDetails from './LobbyDetails';

interface LobbyProps {
  lobbyId: string;
}

interface LobbyDetailsData {
  selectedGame: string;
  selectedMode: string;
  maxPlayers: number;
  inviteCode: string;
}

interface Participant {
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
}

const Lobby: React.FC<LobbyProps> = ({ lobbyId }) => {
  const [lobbyDetails, setLobbyDetails] = useState<LobbyDetailsData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLobbyDetails = async () => {
      try {
        setLoading(true);

        const lobbyResponse = await fetch(`/api/lobby?lobbyId=${lobbyId}`);
        if (!lobbyResponse.ok) throw new Error('Failed to fetch lobby details');
        const lobbyData = await lobbyResponse.json();

        const participantsResponse = await fetch(`/api/lobby/${lobbyId}`);
        if (!participantsResponse.ok) throw new Error('Failed to fetch lobby participants');
        const { participants: participantData } = await participantsResponse.json();

        setLobbyDetails({
          selectedGame: lobbyData.selectedGame,
          selectedMode: lobbyData.selectedMode,
          maxPlayers: lobbyData.maxPlayers,
          inviteCode: lobbyData.inviteCode,
        });
        setParticipants(participantData);
      } catch (err) {
        setError('Failed to load lobby details or participants');
      } finally {
        setLoading(false);
      }
    };

    fetchLobbyDetails();
  }, [lobbyId]);

  useEffect(() => {
    const eventSource = new EventSource(`/api/lobby/${lobbyId}/events`);

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);

      if (eventData.type === 'participant-joined') {
        setParticipants((prevParticipants) => [
          ...prevParticipants,
          eventData.participant,
        ]);
      }
    };

    eventSource.onerror = () => {
      console.error('Error in SSE connection');
    };

    return () => {
      eventSource.close();
    };
  }, [lobbyId]);

  if (loading) return <p>Loading lobby details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {!lobbyDetails ? (
        <p>No longer in a lobby</p>
      ) : (
        <LobbyDetails
          selectedGame={lobbyDetails.selectedGame}
          selectedMode={lobbyDetails.selectedMode}
          maxPlayers={lobbyDetails.maxPlayers}
          inviteCode={lobbyDetails.inviteCode}
          members={participants}
        />
      )}
    </div>
  );
};

export default Lobby;
