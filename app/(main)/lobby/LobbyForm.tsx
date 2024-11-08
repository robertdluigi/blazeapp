'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useCreateLobby } from './mutations'; // Import the custom hook for creating a lobby
import { CreateLobbyInput } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast'; // Assuming you have a toast system

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
  const [error, setError] = useState('');
  const { toast } = useToast(); // Toast to show notifications
  const createLobbyMutation = useCreateLobby(); // Use the mutation hook

  const handleLobbyCreation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGame) {
      setError('Please select a game.');
      return;
    }

    // Reset error before starting the mutation
    setError('');

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
        // Optionally revalidate the path if necessary
        console.log('Lobby created successfully:', newLobby);
        toast({ description: 'Lobby created successfully!' });
        // Optionally navigate to the new lobby or reset the form
      },
      onError: (err) => {
        setError('Failed to create lobby. Please try again.');
        console.error('Error creating lobby:', err);
      },
    });
  };

  return (
    <div className="flex flex-col items-center w-full justify-center p-4">
      <h1 className="text-2xl font-bold mb-6">Create Lobby</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Card className="p-6 rounded-lg shadow-md w-full max-w-lg">
        <form onSubmit={handleLobbyCreation}>
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
              <option value="">Select a mode</option>
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
      </Card>
    </div>
  );
};

export default LobbyForm;
