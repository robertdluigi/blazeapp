import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import { formatPlaytime } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface GameDetails {
  appid: number;
  name: string;
  playtime_forever: number; // Playtime in minutes
  imgUrl: string;
}

interface SteamFavGamesProps {
  title: string;
  content: { steamGames: number[] }; // List of Steam app IDs
  userId: string;
}

const SteamFavGames: React.FC<SteamFavGamesProps> = ({ title, content, userId }) => {
  // Use React Query to fetch and cache game details
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user-steam-games', userId], // Cache key based on userId
    queryFn: async () => {
      const response = await axios.get(`/api/users/${userId}/games/steam`);
      const { games } = response.data;
      return games.filter((game: GameDetails) => content.steamGames.includes(game.appid));
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  if (isError) {
    return <p className="text-red-500">Failed to load Steam game details.</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-gray-500">No favorite Steam games listed.</p>;
  }

  return (
    <div className="">
      <ul className="space-y-4">
        {data.map((game: GameDetails) => (
          <li key={game.appid} className="flex items-center space-x-4">
            <Image
              src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/capsule_231x87.jpg` || '/default-game-image.png'}
              alt={game.name || `Game ${game.appid}`}
              className="w-48 h-16 object-cover"
              width={256}
              height={256}
            />
            <div>
              <h4 className="text-lg font-medium">{game.name}</h4>
              <p className="text-gray-600">Hours Played: {formatPlaytime(game.playtime_forever)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SteamFavGames;
