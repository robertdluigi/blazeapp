"use client";

import MasteryLevel from "@/assets/lol-mastery/masterycrest_level_9_art.png";

import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Define the ChampionMastery interface based on your API response
interface ChampionMastery {
  championLevel: number;
  championPoints: number;
}

interface UserLeagueFavChampionsProps {
  userId: string | null; // User's database ID
  userPUUID: string | null; // User's Riot PUUID
  champions: { name: string; championId: number }[];
}

// Simulated static data for champion stats
const staticChampionStats = {
  55: { // Example champion ID for Katarina
    championLevel: 5,
    championPoints: 12000,
    eternals: {
      kills: 100,
      deaths: 50,
      assists: 80,
    },
    winRate: 55.0, // in percentage
  },
  // Add more static data for other champions as needed
};

const UserLeagueFavChampions: React.FC<UserLeagueFavChampionsProps> = ({ userId, userPUUID, champions }) => {
  // Fetch champion stats or use static data
  if (champions.length === 0) {
    return <div>No favorite champions found.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {champions.map((champion) => {
        // Get static stats for the champion, or use defaults if not found
        const stats = staticChampionStats[champion.championId] || {
          championLevel: 0,
          championPoints: 0,
          eternals: { kills: 0, deaths: 0, assists: 0 },
          winRate: 0,
        };

        return (
          <div key={champion.championId} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-48 h-48">
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.name}_0.jpg`}
                alt={champion.name}
                layout="fill"
                objectFit="cover"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-50 text-white">
                <h3 className="text-xl font-bold mb-6">{champion.name}</h3>
                <p className="text-sm mb-1 p-4">
                <Image
                src={MasteryLevel}
                width={128}
                height={128}
                alt="Mastery level"
              /></p>
                <p className="text-sm mb-1">Eternals - Kills: {stats.eternals.kills}, Deaths: {stats.eternals.deaths}, Assists: {stats.eternals.assists}</p>
                <p className="text-sm">Win Rate: {stats.winRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserLeagueFavChampions;
