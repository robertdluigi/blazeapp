'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useCreateLobby } from './mutations';
import { CreateLobbyInput } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

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
  const [lobbyId, setLobbyId] = useState(''); // State for the lobby ID input
  const { toast } = useToast();

  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Access the router instance
  const createLobbyMutation = useCreateLobby(); // Mutation for creating a lobby
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
              <label htmlFor="lobby-id" className="block text-sm font-medium text-gray-300 mb-2">
                Lobby ID
              </label>
              <Input
                type="text"
                id="lobby-id"
                value={lobbyId}
                onChange={(e) => setLobbyId(e.target.value)}
                placeholder="Enter lobby ID"
                required
              />
            </div>
              <Button
              disabled={isJoining}
              onClick={joinLobby} className="w-full">
                Join Lobby
              </Button>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default LobbyForm;
