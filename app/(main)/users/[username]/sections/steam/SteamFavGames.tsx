// SteamFavGames.tsx

// Define props for the SteamFavGames component
interface SteamFavGamesProps {
  title: string;
  content: string[]; // List of favorite games
}

const SteamFavGames: React.FC<SteamFavGamesProps> = ({ title, content }) => {
  return (
    <div className="steam-fav-games-section">
      <h3>{title}</h3>
      <ul>
        {content.map((game, index) => (
          <li key={index}>{game}</li>
        ))}
      </ul>
    </div>
  );
};

export default SteamFavGames;
