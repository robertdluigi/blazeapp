"use client";

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ky from '@/lib/ky';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Match } from '@/types/riot';
import { MatchV5DTOs } from '@/types/match';
import { getChampionImageUrl } from '@/lib/champions';
import { motion, AnimatePresence } from 'framer-motion';

interface UserLeagueMatchesProps {
  userId: string;
  riotPUUID: string;
}

function calculateKDA(kills?: number, deaths?: number, assists?: number): string {
  kills = kills ?? 0;
  deaths = deaths ?? 1;
  assists = assists ?? 0;
  
  const kda = (kills + assists) / deaths;
  return kda.toFixed(2);
}

function getKDAColor(kda: number): string {
  if (kda >= 5) return 'text-orange-700';
  if (kda >= 4) return 'text-yellow-700';
  if (kda >= 3) return 'text-green-700';
  if (kda >= 2) return 'text-blue-700';
  return 'text-gray-700';
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
          kills: p.kills,
          deaths: p.deaths,
          assists: p.assists,
          teamId: p.teamId,
          puuid: p.puuid,
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

export default function UserLeagueMatches({ userId, riotPUUID }: UserLeagueMatchesProps) {
  const [expandedMatches, setExpandedMatches] = useState<Set<string>>(new Set());

  const { data, isFetching, isError, error } = useQuery<Match[], Error>({
    queryKey: ['user-league-matches', userId],
    queryFn: () => fetchMatches(userId, riotPUUID),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
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

  const toggleMatchDetails = (matchId: string) => {
    setExpandedMatches(prev => {
      const newSet = new Set(prev);
      if (newSet.has(matchId)) {
        newSet.delete(matchId);
      } else {
        newSet.add(matchId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-4">
      {data.map((match) => {
        const participant = match.participants.find(p => p.puuid === riotPUUID) as MatchV5DTOs.ParticipantDto;
        const kdaValue = parseFloat(calculateKDA(participant?.kills, participant?.deaths, participant?.assists));
        const kdaColor = getKDAColor(kdaValue);
        const isExpanded = expandedMatches.has(match.gameId);

        return (
          <motion.div 
            key={match.gameId} 
            className="border rounded-lg overflow-hidden"
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              className={`flex items-center p-2 ${
                match.win ? 'bg-green-200' : 'bg-pink-200'
              }`}
            >
              <div className="w-20 text-center">
                <p className={`text-sm font-semibold ${match.win ? 'text-green-900' : 'text-red-900'}`}>
                  {match.win ? 'Victory' : 'Defeat'}
                </p>
                <p className="text-xs text-gray-600">{formatDistanceToNow(new Date(match.timestamp))} ago</p>
              </div>
              <div className="w-16 flex-shrink-0">
                <img
                  src={getChampionImageUrl(match.champion)}
                  alt={match.champion}
                  className="w-12 h-12 rounded-full mx-auto"
                />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">{match.champion}</p>
                <p className="text-sm text-gray-600">{match.role}</p>
              </div>
              <div className="w-20 text-center">
                <p className="text-sm font-semibold text-gray-700">KDA</p>
                <p className="text-xs text-gray-600">
                  {participant?.kills ?? 0}/
                  {participant?.deaths ?? 0}/
                  {participant?.assists ?? 0}
                </p>
                <p className={`text-xs font-bold ${kdaColor}`}>
                  ({kdaValue.toFixed(2)})
                </p>
              </div>
              <div className="w-20 text-right">
                <motion.button
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center"
                  onClick={() => toggleMatchDetails(match.gameId)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isExpanded ? (
                    <>
                      Hide <ChevronUp className="ml-1 w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Details <ChevronDown className="ml-1 w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="bg-gray-900 overflow-hidden"
                >
                  <div className="p-2">
                    <h3 className="font-semibold mb-2 text-gray-400 text-xs">Participants</h3>
                    <div className="flex justify-between mb-2">
                      {[0, 1].map(teamIndex => (
                        <div key={teamIndex} className="w-[48%] bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-md">
                          <h4 className="text-xs font-semibold mb-2 text-center text-gray-400">
                            {teamIndex === 0 ? 'Ally Team' : 'Enemy Team'}
                          </h4>
                          <div className="grid grid-cols-5 gap-x-0.5 gap-y-1">
                            {match.participants
                              .filter(p => (teamIndex === 0 ? p.teamId === participant.teamId : p.teamId !== participant.teamId))
                              .map((p, index) => (
                                <motion.div 
                                  key={index} 
                                  className="flex flex-col items-center"
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.02 }}
                                >
                                  <img
                                    src={getChampionImageUrl(p.champion)}
                                    alt={p.champion}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <span className={`text-xs ${p.puuid === riotPUUID ? 'font-bold text-gray-300' : 'text-gray-400'} truncate w-full text-center`}>
                                    {p.name}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {p.kills}/{p.deaths}/{p.assists}
                                  </span>
                                </motion.div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <h3 className="font-semibold mt-2 mb-1 text-gray-400 text-xs">Reviews</h3>
                    <div className="space-y-2">
                      <div className="bg-gray-800 p-2 rounded">
                        <p className="font-semibold text-gray-300">User123</p>
                        <p className="text-sm text-gray-400">Great game! The team coordination was on point.</p>
                      </div>
                      <div className="bg-gray-800 p-2 rounded">
                        <p className="font-semibold text-gray-300">ProGamer456</p>
                        <p className="text-sm text-gray-400">Tough match, but we learned a lot from it.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
