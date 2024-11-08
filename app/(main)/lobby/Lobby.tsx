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

// Define the structure for a participant
interface Participant {
  username: string;
  displayName: string;
  avatarUrl: string; // URL to the profile picture
  bannerUrl: string; // Optional: URL to the banner picture
}

const Lobby: React.FC<LobbyProps> = ({ lobbyId }) => {
  const [lobbyDetails, setLobbyDetails] = useState<LobbyDetailsData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]); // Changed to hold detailed participant data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLobbyDetails = async () => {
      try {
        setLoading(true);

        // Check localStorage for cached lobby details
        const cachedLobbyDetails = localStorage.getItem(`lobbyDetails_${lobbyId}`);
        const cachedParticipants = localStorage.getItem(`participants_${lobbyId}`);

        if (cachedLobbyDetails) {
          setLobbyDetails(JSON.parse(cachedLobbyDetails));
        }

        if (cachedParticipants) {
          setParticipants(JSON.parse(cachedParticipants));
        }

        // Fetch lobby details from the backend if not cached
        const lobbyResponse = await fetch(`/api/lobby?lobbyId=${lobbyId}`);
        if (!lobbyResponse.ok) {
          throw new Error('Failed to fetch lobby details');
        }
        const lobbyData = await lobbyResponse.json();

        // Fetch lobby participants
        const participantsResponse = await fetch(`/api/lobby/${lobbyId}`);
        if (!participantsResponse.ok) {
          throw new Error('Failed to fetch lobby participants');
        }

        const { participants: participantData } = await participantsResponse.json();

        // Assume participantData is an array of objects containing name, profilePic, etc.
        // Example structure: [{ name: 'Player1', profilePic: 'url1', bannerPic: 'url2' }, ...]
        
        // Set the lobby details based on fetched data
        const newLobbyDetails: LobbyDetailsData = {
          selectedGame: lobbyData.selectedGame || 'Unknown Game',
          selectedMode: lobbyData.selectedMode || 'Unknown Mode',
          maxPlayers: lobbyData.maxPlayers || 0,
          inviteCode: lobbyData.inviteCode || 'No Code',
        };

        // Cache the new data
        localStorage.setItem(`lobbyDetails_${lobbyId}`, JSON.stringify(newLobbyDetails));
        localStorage.setItem(`participants_${lobbyId}`, JSON.stringify(participantData));

        // Update state
        setLobbyDetails(newLobbyDetails);
        setParticipants(participantData); // Set detailed participant data

      } catch (err) {
        console.error('Error fetching lobby details or participants:', err);
        setError('Failed to load lobby details or participants. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (lobbyId) {
      fetchLobbyDetails();
    }
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
          members={participants} // Pass detailed participants data to LobbyDetails
        />
      )}
    </div>
  );
};

export default Lobby;
