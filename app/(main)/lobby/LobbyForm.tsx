'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCreateLobby } from './mutations';
import { CreateLobbyInput } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash'; // For debouncing
import JoinLobbyButton from '@/components/JoinLobbyButton';

const games = [
  { value: '', label: 'Select a game' },
  { value: 'game1', label: 'Game 1' },
  { value: 'game2', label: 'Game 2' },
  { value: 'game3', label: 'Game 3' },
];

const modes = [
  { value: 'competitive', label: 'Competitive' },
  { value: 'casual', label: 'Casual' },
  { value: 'co-op', label: 'Co-op' },
];

const LobbyForm: React.FC<{ userId: string }> = ({ userId }) => {
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedMode, setSelectedMode] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(5);
  const [inviteCode, setInviteCode] = useState('');
  const [lobbyId, setLobbyId] = useState<string | null>(null); // State for the lobbyId
  const { toast } = useToast();
  const router = useRouter();

  const createLobbyMutation = useCreateLobby(); // Mutation for creating a lobby

  // Function to fetch lobbyId based on inviteCode
  const fetchLobbyId = async (code: string) => {
    if (code.trim() === '') {
      setLobbyId(null);
      return;
    }

    try {
      const response = await fetch(`/api/lobby/find-by-invite/${code}`);
      if (response.ok) {
        const data = await response.json();
        setLobbyId(data.lobbyId); // Set the lobbyId from the API response
      } else {
        setLobbyId(null); // Handle case where the invite code is invalid
      }
    } catch (err) {
      console.error('Error fetching lobby:', err);
      setLobbyId(null);
    }
  };

  // Debounced version of fetchLobbyId to avoid frequent calls on each keystroke
  const debouncedFetchLobbyId = debounce((code: string) => {
    fetchLobbyId(code);
  }, 500);

  useEffect(() => {
    debouncedFetchLobbyId(inviteCode); // Call the debounced function
  }, [inviteCode]);

  const handleCreateLobby = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGame) {
      toast({ description: 'Please select a game.' });
      return;
    }

    const generatedInviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const input: CreateLobbyInput = {
      userId,
      gameTitle: selectedGame,
      gameMode: selectedMode,
      maxPlayers,
      inviteCode: generatedInviteCode,
    };

    createLobbyMutation.mutate(input, {
      onSuccess: (newLobby) => {
        toast({ description: 'Lobby created successfully!' });
      },
      onError: (err) => {
        toast({ description: 'Failed to create lobby. Please try again.' });
      },
    });
  };

  // Update the invite code state as the user types
  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setInviteCode(code); // Update invite code state
  };
  return (
    <div className="flex flex-col items-center w-full justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Lobby Management</h1>
      <Card className="p-6 rounded-lg shadow-md w-full max-w-lg">
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="create">Create Lobby</TabsTrigger>
            <TabsTrigger value="join">Join Lobby</TabsTrigger>
          </TabsList>

          {/* Create Lobby Tab */}
          <TabsContent value="create">
            <form onSubmit={handleCreateLobby}>
              <div className="mb-4">
                <label htmlFor="game-select" className="block text-sm font-medium text-gray-300 mb-2">
                  Game Title
                </label>
                <select
                  id="game-select"
                  value={selectedGame}
                  onChange={(e) => setSelectedGame(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  {games.map((game) => (
                    <option key={game.value} value={game.value}>
                      {game.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="mode-select" className="block text-sm font-medium text-gray-300 mb-2">
                  Game Mode
                </label>
                <select
                  id="mode-select"
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="block w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  {modes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="max-players" className="block text-sm font-medium text-gray-300 mb-2">
                  Max Players
                </label>
                <Input
                  type="number"
                  id="max-players"
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  min={1}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={createLobbyMutation.isPending}>
                {createLobbyMutation.isPending ? 'Creating...' : 'Create Lobby'}
              </Button>
            </form>
          </TabsContent>
          
          {/* Join Lobby Tab */}
          <TabsContent value="join">
            <div className="mb-4">
              <label htmlFor="invite-code" className="block text-sm font-medium text-gray-300 mb-2">
                Invite Code
              </label>
              <Input
                type="text"
                id="invite-code"
                value={inviteCode}
                onChange={handleInviteCodeChange} // Use the updated change handler
                placeholder="Enter invite code"
                required
              />
              {lobbyId && <p className="text-green-500 mt-2">Lobby ID: {lobbyId}</p>} {/* Show Lobby ID */}
            </div>
            <JoinLobbyButton lobbyId={lobbyId} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LobbyForm;
