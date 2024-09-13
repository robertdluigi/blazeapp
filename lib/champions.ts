import championData from '@/lib/riot/champions.json'; // Ensure the path to your JSON file is correct

// Champion data type based on the JSON structure
interface ChampionData {
  id: string;
  key: string;
  name: string;
}

// Convert the JSON data into a more usable format
const champions: Record<string, ChampionData> = championData.data;

// Create a reverse mapping from ID to champion name
const idToChampionName: Record<string, string> = Object.keys(champions).reduce((acc, championName) => {
  const champion = champions[championName];
  acc[champion.key] = champion.id;
  return acc;
}, {} as Record<string, string>);

// Function to get the champion ID from the champion name
export const getChampionIdFromName = (championName: string): string | null => {
  const champion = champions[championName];
  return champion ? champion.key : null;
};

// Function to get the champion name from the champion ID
export const getChampionNameFromId = (championId: number): string | null => {
  return idToChampionName[championId] || null;
};

// Function to get the champion image URL
export const getChampionImageUrl = (championName: string, version: string = '14.17.1'): string => {
  return championName ? `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png` : '';
};
