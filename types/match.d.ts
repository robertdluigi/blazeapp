// types/match.d.ts
export namespace MatchV5DTOs {
    export interface MatchDto {
      metadata: MetadataDto;
      info: InfoDto;
    }
  
    export interface MetadataDto {
      dataVersion: string;
      matchId: string;
      participants: string[];
    }
  
    export interface InfoDto {
      gameCreation: number;
      gameDuration: number;
      gameId: number;
      gameMode: string;
      gameName: string;
      gameStartTimestamp: number;
      gameType: string;
      gameVersion: string;
      mapId: number;
      participants: ParticipantDto[];
      platformId: string;
      queueId: number;
      teams: TeamDto[];
      tournamentCode: string;
    }
  
    export interface ParticipantDto {
      allInPings: number;
      assistMePings: number;
      assists: number;
      baitPings: number;
      baronKills: number;
      basicPings: number;
      bountyLevel: number;
      challenges: ChallengesDto;
      champExperience: number;
      champLevel: number;
      championId: number;
      championName: string;
      championTransform: number;
      commandPings: number;
      consumablesPurchased: number;
      damageDealtToBuildings: number;
      damageDealtToObjectives: number;
      damageDealtToTurrets: number;
      damageSelfMitigated: number;
      dangerPings: number;
      deaths: number;
      detectorWardsPlaced: number;
      doubleKills: number;
      dragonKills: number;
      eligibleForProgression: boolean;
      enemyMissingPings: number;
      enemyVisionPings: number;
      firstBloodAssist: boolean;
      firstBloodKill: boolean;
      firstTowerAssist: boolean;
      firstTowerKill: boolean;
      gameEndedInEarlySurrender: boolean;
      gameEndedInSurrender: boolean;
      getBackPings: number;
      goldEarned: number;
      goldSpent: number;
      holdPings: number;
      individualPosition: Position;
      inhibitorKills: number;
      inhibitorTakedowns: number;
      inhibitorsLost: number;
      item0: number;
      item1: number;
      item2: number;
      item3: number;
      item4: number;
      item5: number;
      item6: number;
      itemsPurchased: number;
      killingSprees: number;
      kills: number;
      lane: Lane;
      largestCriticalStrike: number;
      largestKillingSpree: number;
      largestMultiKill: number;
      longestTimeSpentLiving: number;
      magicDamageDealt: number;
      magicDamageDealtToChampions: number;
      magicDamageTaken: number;
      missions: MissionsDto;
      needVisionPings: number;
      neutralMinionsKilled: number;
      nexusKills: number;
      nexusLost: number;
      nexusTakedowns: number;
      objectivesStolen: number;
      objectivesStolenAssists: number;
      onMyWayPings: number;
      participantId: number;
      pentaKills: number;
      perks: PerksDto;
      physicalDamageDealt: number;
      physicalDamageDealtToChampions: number;
      physicalDamageTaken: number;
      profileIcon: number;
      pushPings: number;
      puuid: string;
      quadraKills: number;
      riotIdName?: string;
      riotIdGameName?: string;
      riotIdTagline: string;
      role: Role;
      sightWardsBoughtInGame: number;
      spell1Casts: number;
      spell2Casts: number;
      spell3Casts: number;
      spell4Casts: number;
      summoner1Casts: number;
      summoner1Id: number;
      summoner2Casts: number;
      summoner2Id: number;
      summonerId: string;
      summonerLevel: number;
      summonerName: string;
      teamEarlySurrendered: boolean;
      teamId: number;
      teamPosition: Position;
      timeCCingOthers: number;
      timePlayed: number;
      totalAllyJungleMinionsKilled: number;
      totalDamageDealt: number;
      totalDamageDealtToChampions: number;
      totalDamageShieldedOnTeammates: number;
      totalDamageTaken: number;
      totalEnemyJungleMinionsKilled: number;
      totalHeal: number;
      totalHealsOnTeammates: number;
      totalMinionsKilled: number;
      totalTimeCCDealt: number;
      totalTimeSpentDead: number;
      totalUnitsHealed: number;
      tripleKills: number;
      trueDamageDealt: number;
      trueDamageDealtToChampions: number;
      trueDamageTaken: number;
      turretKills: number;
      turretTakedowns: number;
      turretsLost: number;
      unrealKills: number;
      visionScore: number;
      visionWardsBoughtInGame: number;
      wardsKilled: number;
      wardsPlaced: number;
      win: boolean;
    }
  
    export interface ChallengesDto {
      // Challenge fields here
    }
  
    export interface MissionsDto {
      playerScore0: number;
      playerScore1: number;
      playerScore2: number;
      playerScore3: number;
      playerScore4: number;
      playerScore5: number;
      playerScore6: number;
      playerScore7: number;
      playerScore8: number;
      playerScore9: number;
    }
  
    export interface PerksDto {
      statPerks: PerkStatsDto;
      styles: PerkStyleDto[];
    }
  
    export interface PerkStatsDto {
      defense: number;
      flex: number;
      offense: number;
    }
  
    export interface PerkStyleDto {
      description: Description;
      selections: PerkStyleSelectionDto[];
      style: number;
    }
  
    export interface PerkStyleSelectionDto {
      perk: number;
      var1: number;
      var2: number;
      var3: number;
    }
  
    export interface TeamDto {
      bans: BanDto[];
      objectives: ObjectivesDto;
      teamId: number;
      win: boolean;
    }
  
    export interface BanDto {
      championId: number;
      pickTurn: number;
    }
  
    export interface ObjectivesDto {
      baron: ObjectiveDto;
      champion: ObjectiveDto;
      dragon: ObjectiveDto;
      inhibitor: ObjectiveDto;
      riftHerald: ObjectiveDto;
      tower: ObjectiveDto;
    }
  
    export interface ObjectiveDto {
      first: boolean;
      kills: number;
    }
  
    export type Description = "primaryStyle" | "subStyle";
    export type Position = "" | "Invalid" | "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY";
    export type Role = "SOLO" | "NONE" | "CARRY" | "SUPPORT";
    export type Lane = "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM";
  }
  