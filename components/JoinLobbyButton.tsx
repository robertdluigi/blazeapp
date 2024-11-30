'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter hook

interface JoinLobbyButtonProps {
  lobbyId: string;
}

const JoinLobbyButton: React.FC<JoinLobbyButtonProps> = ({ lobbyId }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Access the router instance

  const joinLobby = async () => {
    setIsJoining(true);
    setError(null);

    try {
      // Send POST request to join the lobby
      const response = await fetch(`/api/lobby/${lobbyId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      router.refresh();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div>
      <button
        onClick={joinLobby}
        disabled={isJoining}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isJoining ? 'Joining...' : 'Join Lobby'}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default JoinLobbyButton;
