import SteamFavGames from './sections/steam/SteamFavGames';
import { SectionType } from '@/lib/sections';
import { ChampionsSectionProps, ContentSectionProps, BaseSectionProps } from '@/types/section';
import UserLeagueFavChampions from './sections/league/UserLeagueFavChampions';
import { UserData } from '@/lib/types';

interface UserProfileSectionProps {
  user: UserData;
  type: SectionType;
  data: ChampionsSectionProps | ContentSectionProps | BaseSectionProps;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ user, type, data }) => {
  switch (type) {
    case SectionType.USER_STEAM_FAV_GAMES:
      const steamContent = { steamGames: data.content as unknown as number[] }; // Ensure it's wrapped in an object with steamGames key
      return (
        <div className="bg-card rounded-lg p-4 shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
          <SteamFavGames title={data.title} content={steamContent} userId={user.id} />
        </div>
      );

    case SectionType.USER_PROFILE_HIGHLIGHTS:
      const highlightsContent = data.content as string[];
      return (
        <div className="bg-card border border-gray-200 rounded-lg p-4 shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
          <ul className="list-disc list-inside space-y-1">
            {highlightsContent.map((highlight, index) => (
              <li key={index} className="text-gray-700">{highlight}</li>
            ))}
          </ul>
        </div>
      );

    case SectionType.USER_LEAGUE_FAV_CHAMPIONS:
      console.log('Data received in UserProfileSection:', data);

      // Parse the JSON content safely
      let championsContent;
      try {
        championsContent = JSON.parse(data.content as string) as ChampionsSectionProps; // Parse the string and cast it to ChampionsSectionProps
      } catch (error) {
        console.error('Error parsing champions content:', error);
        championsContent = { champions: [] }; // Fallback in case of parsing error
      }

      console.log('Champions Content:', championsContent);

      // Check if championsContent.champions is defined and is an array
      if (!championsContent.champions || championsContent.champions.length === 0) {
        return (
          <div className="bg-card rounded-lg p-4 shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
            <div>No favorite champions found.</div>
          </div>
        );
      }

      const championsList = championsContent.champions.map(champ => ({
        name: champ.name,
        championId: Number(champ.championId), // Convert championId to number
      }));

      console.log('Champions List:', championsList);

      return (
        <div className="bg-card rounded-lg p-4 shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
          <UserLeagueFavChampions userId={user.id} userPUUID={user.riotPUUID} champions={championsList} />
        </div>
      );

    case SectionType.CUSTOM:
      const customContent = data.content as string;
      return (
        <div className="bg-card rounded-lg p-4 shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
          <p className="text-gray-700">{customContent}</p>
        </div>
      );

    default:
      return null;
  }
};

export default UserProfileSection;
