"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ky from '@/lib/ky'; // Ensure ky is properly configured
import { Loader2 } from 'lucide-react'; // Or another spinner component
import { formatDate } from 'date-fns';
import { Match } from '@/types/riot'; // Ensure correct import
import { MatchV5DTOs } from '@/types/match';
import { getChampionImageUrl } from '@/lib/champions'; // Ensure you have these functions

interface UserLeagueMatchesProps {
  userId: string;
  riotPUUID: string; // Add riotPUUID to props
}

const fetchMatches = async (userId: string, riotPUUID: string): Promise<Match[]> => {
  try {
    const matchIdsResponse = await ky.get(`/api/users/${userId}/riot/league/matches`).json<string[]>();

    if (!matchIdsResponse.length) {
      return [];
    }

    const matchDetailsPromises = matchIdsResponse.map(async (matchId) => {
      const matchData = await ky.get(`/api/users/${userId}/riot/league/match/${matchId}`).json<MatchV5DTOs.MatchDto>();

      const participant = matchData.info.participants.find((p) => p.puuid === riotPUUID);

      if (!participant) {
        return null;
      }

      const team = matchData.info.teams.find(team => team.teamId === participant.teamId);
      const enemyTeam = matchData.info.teams.find(team => team.teamId !== participant.teamId);
      const win = team?.win ?? false;

      return {
        gameId: matchData.metadata.matchId,
        champion: participant.championName,
        role: participant.role,
        lane: participant.lane,
        timestamp: matchData.info.gameCreation,
        participants: matchData.info.participants.map(p => ({
          name: p.summonerName,
          champion: p.championName,
          teamId: p.teamId, // Include teamId
          puuid: p.puuid,   // Include puuid
        })),
        win,
        teamBans: team?.bans ?? [],
        teamObjectives: team?.objectives ?? {},
        enemyTeamBans: enemyTeam?.bans ?? [],
        enemyTeamObjectives: enemyTeam?.objectives ?? {},
      } as unknown as Match;
    });

    const matchDetails = await Promise.all(matchDetailsPromises);

    return matchDetails.filter((match): match is Match => match !== null);
  } catch (err) {
    console.error('Error fetching matches:', err);
    throw err;
  }
};

// UserLeagueMatches component
export default function UserLeagueMatches({ userId, riotPUUID }: UserLeagueMatchesProps) {
  const { data, isFetching, isError, error } = useQuery<Match[], Error>({
    queryKey: ['user-league-matches', userId],
    queryFn: () => fetchMatches(userId, riotPUUID),
  });

  if (isFetching) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  if (isError) {
    return <p className="text-center text-destructive">Error: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-center">No matches found</p>;
  }

  return (
    <div>
      <h2 className="text-center text-lg font-bold mb-4">Recent League of Legends Matches</h2>
      <ul className="space-y-4">
        {data.map((match) => (
          <li
            key={match.gameId}
            className={`border p-3 rounded-lg shadow-md ${match.win ? 'bg-green-100' : 'bg-red-100'}`}
          >
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-16 h-16">
                <img
                  src={getChampionImageUrl(match.champion)}
                  alt={`Champion ${match.champion}`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-semibold text-md">{match.champion}</p>
                    <p><strong>Role:</strong> {match.role}</p>
                    <p><strong>Lane:</strong> {match.lane}</p>
                    <p><strong>Date:</strong> {formatDate(new Date(match.timestamp), 'MMM dd, yyyy HH:mm')}</p>
                  </div>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                    onClick={() => alert('Review functionality coming soon!')}
                  >
                    Review
                  </button>
                </div>
                <div className="flex">
                  <div className="flex-1 pr-2">
                    <h3 className="text-sm font-semibold mb-1">My Team</h3>
                    <ul className="flex flex-col space-y-2">
                      {match.participants
                        .filter(p => p.teamId === match.participants.find(participant => participant.puuid === riotPUUID)?.teamId)
                        .map((p, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <img
                              src={getChampionImageUrl(p.champion)}
                              alt={`Champion ${p.champion}`}
                              className="w-8 h-8 object-cover rounded-full"
                            />
                            <span className="text-sm">{p.name}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                  <div className="flex-1 pl-2">
                    <h3 className="text-sm font-semibold mb-1">Enemy Team</h3>
                    <ul className="flex flex-col space-y-2">
                      {match.participants
                        .filter(p => p.teamId !== match.participants.find(participant => participant.puuid === riotPUUID)?.teamId)
                        .map((p, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <img
                              src={getChampionImageUrl(p.champion)}
                              alt={`Champion ${p.champion}`}
                              className="w-8 h-8 object-cover rounded-full"
                            />
                            <span className="text-sm">{p.name}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
