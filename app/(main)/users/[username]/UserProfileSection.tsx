// UserProfileSection.tsx

import SteamFavGames from './sections/steam/SteamFavGames';
import { SectionType } from '@/lib/sections';
import { ChampionsSectionProps, ContentSectionProps, BaseSectionProps } from '@/types/section'; 
import UserLeagueFavChampions from './sections/league/UserLeagueFavChampions';
import UserGenshinFavCharacter from './sections/genshin/FAV_Character';
import { UserData } from '@/lib/types';

interface UserProfileSectionProps {
  user: UserData;
  type: SectionType;
  data: ChampionsSectionProps | ContentSectionProps | BaseSectionProps;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ user, type, data }) => {
  switch (type) {
    case SectionType.USER_STEAM_FAV_GAMES:
      const steamContent = data.content as string[]; // Assuming content is an array of strings
      return (
        <div className="bg-card border border-gray-200 rounded-lg p-4 shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
          <SteamFavGames title={data.title} content={steamContent} />
        </div>
      );

    case SectionType.USER_PROFILE_HIGHLIGHTS:
      const highlightsContent = data.content as string[]; // Example for highlights
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
      const championsContent = data.content as unknown as { champions: string[] }; // Ensure content is typed correctly
      return (
        <div className="bg-card  rounded-lg p-4 shadow-md mb-4">
          <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
          <UserLeagueFavChampions title={data.title} champions={championsContent.champions || []} />
        </div>
      );
    // Genshin, later ..
    // case SectionType.USER_GENSHIN_FAV_CHARACTER:
    //   const characterContent = data.content as unknown as { character: string[] };
    //   return (
    //     <div className="bg-card rounded-lg p-4 shadow-md mb-4">
    //       <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
    //       <UserGenshinFavCharacter 
    //         genshinUid={user?.genshinUid ?? ''} 
    //         character="Ayaka" 
    //       />
    //     </div>
    //   );

    case SectionType.CUSTOM:
      const customContent = data.content as string; // Example for custom content
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
