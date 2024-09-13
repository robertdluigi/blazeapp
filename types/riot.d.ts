// types/riot.d.ts

export interface SummonerData {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface RiotAccountData {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface MatchParticipant {
  puuid: string;
  championId: number;
  role: string;
  lane: string;
  name: string;
  champion: string;
  teamId: number; // Add this line
  puuid: string; // Add this line
  // Add other fields as needed
}

export interface MatchInfo {
  gameId: string; // Typically a string
  gameCreation: number; // Timestamp in milliseconds
  participants: MatchParticipant[];
  // Add other fields as needed
}

export interface MatchData {
  metadata: {
    matchId: string; // Typically a string
  };
  info: MatchInfo;
}

export interface Match {
  gameId: string;
  champion: string;
  role: string;
  lane: string;
  timestamp: number;
  participants: Participant[]; // Ensure this reflects the Participant type
  win: boolean;
}

export interface MatchListData {
  matches: Match[];
  totalGames: number;
  startIndex: number;
  endIndex: number;
}
