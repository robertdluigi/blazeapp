'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Gamepad2, Maximize2, Key } from 'lucide-react';
import LobbyBackground from './LobbyBackground';
import { ExpandableCard } from './ExpandableCard'; // Import the ExpandableCard

interface LobbyDetailsProps {
  selectedGame: string;
  selectedMode: string;
  maxPlayers: number;
  inviteCode: string;
  members: {
    username: string;
    displayName: string;
    avatarUrl: string; // URL to the profile picture
    bannerUrl: string; // URL to the banner picture (if you want to include it)
  }[];
}

const LobbyDetails: React.FC<LobbyDetailsProps> = ({
  selectedGame,
  selectedMode,
  maxPlayers,
  inviteCode,
  members,
}) => {
  const participantCount = members.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full h-full">
      {/* Left Section: Players List */}
      <div className="col-span-1 md:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg h-full">
        <h2 className="text-2xl font-bold mb-6 text-white">Lobby Members</h2>

        <ScrollArea className="h-3/4 rounded-lg overflow-hidden bg-gray-900 shadow-md p-4 relative">
        /* eslint-disable */
          <LobbyBackground className="absolute inset-0 w-full h-full" /> 
        /* eslint-enable */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10 p-2">
            {participantCount > 0 ? (
              members.map((member, index) => (
                <div
                  key={index}
                  className={``}
                >

                  {/* ExpandableCard Trigger */}
                  <ExpandableCard 
                    participants={[{
                      username: member.username,
                      displayName: member.displayName,
                      avatarUrl: member.avatarUrl,
                      ctaText: 'View Profile',
                      ctaLink: `/users/${member.username}`,
                    }]} 
                  />
                </div>
              ))
            ) : (
              <p className="text-gray-500">No members in the lobby yet.</p>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Right Sidebar: Lobby Details */}
      <div className="bg-gray-800 rounded-lg col-span-1 text-white p-4 flex flex-col justify-between h-full">
        <div className="w-full rounded-lg shadow-md text-white">
          <h2 className="text-xl font-bold mb-6">Lobby Details</h2>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Gamepad2 className="w-5 h-5 text-blue-400 mr-2" />
              <p><strong>Game Title:</strong> {selectedGame}</p>
            </div>

            <div className="flex items-center mb-2">
              <Maximize2 className="w-5 h-5 text-green-400 mr-2" />
              <p><strong>Game Mode:</strong> {selectedMode}</p>
            </div>

            <div className="flex items-center mb-2">
              <User className="w-5 h-5 text-purple-400 mr-2" />
              <p><strong>Max Players:</strong> {maxPlayers}</p>
            </div>

            <div className="flex items-center mb-4">
              <Key className="w-5 h-5 text-yellow-400 mr-2" />
              <p><strong>Invite Code:</strong> {inviteCode}</p>
              <Button variant="secondary" className="ml-2 text-xs">Copy</Button>
            </div>
          </div>
        </div>

        {/* Buttons at the bottom of the sidebar */}
        <div className="flex gap-4 mt-auto">
          <Button variant="destructive" className="w-full mb-2">Leave Lobby</Button>
          <Button variant="default" className="w-full">Start Game</Button>
        </div>
      </div>
    </div>
  );
};

export default LobbyDetails;
