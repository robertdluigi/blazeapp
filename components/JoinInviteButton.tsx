'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface JoinInviteButtonProps {
  inviteCode: string;
}

const JoinInviteButton: React.FC<JoinInviteButtonProps> = ({ inviteCode }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const joinLobby = async () => {
    setIsJoining(true);
    setError(null);

    try {
      const lobbyResponse = await fetch(`/api/lobby/find-by-invite/${inviteCode}`);

      if (!lobbyResponse.ok) {
        const errorMessage = await lobbyResponse.text();
        throw new Error(errorMessage);
      }

      const { lobbyId } = await lobbyResponse.json();

      const response = await fetch(`/api/lobby/${lobbyId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to join the lobby');
      }

      router.refresh();
    } catch (err: unknown) {
      setIsJoining(false);
      if (err instanceof Error) {
        setError(err.message);  // Safe to access err.message
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <button
      className="w-full bg-blue-500 text-white py-2 px-4 rounded disabled:bg-gray-300"
      onClick={joinLobby}
      disabled={isJoining}
    >
      {isJoining ? 'Joining...' : 'Join Lobby'}
    </button>
  );
};

export default JoinInviteButton;
