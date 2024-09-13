interface ChampionsSectionProps {
  title: string;
  champions: string[];
  content?: never; // Ensure content is not present
}

const UserLeagueFavChampions: React.FC<ChampionsSectionProps> = ({ title, champions = [] }) => {
  return (
    <div className="league-fav-champions-section">
      <h3>{title}</h3>
      <ul>
        {champions.length > 0 ? (
          champions.map((champion) => (
            <li key={champion}>{champion}</li>
          ))
        ) : (
          <p>No champions available</p>
        )}
      </ul>
    </div>
  );
};

export default UserLeagueFavChampions;
