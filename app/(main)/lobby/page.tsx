// page.tsx
import LobbyForm from './LobbyForm';
import Lobby from './Lobby'; // Ensure you have a Lobby component imported
import { validateRequest } from '@/auth';
import JoinLobbyButton from '@/components/JoinLobbyButton';

export default async function Page() {
  const user = await validateRequest(); // Fetch user data

  // Extract userId and currentLobbyId
  const userId = user.user?.id || null;
  const currentLobbyId = user.user?.currentLobbyId || null; // Assuming currentLobbyId exists

  const handleLobbyCreated = (details: {
    selectedGame: string;
    selectedMode: string;
    maxPlayers: number;
    inviteCode: string;
  }) => {
    // Logic to handle after a lobby is created
    console.log('Lobby created with details:', details);
  };

  // Render the component based on the user's status
  return (
    <div className='w-full grid'>
      {userId ? (
        currentLobbyId ? (
          // If the user has a currentLobbyId, render the Lobby component
          <Lobby lobbyId={currentLobbyId} />
        ) : (
          // Otherwise, render the LobbyForm to create a new lobby
          <div>
          
          <LobbyForm userId={userId} />
          <JoinLobbyButton lobbyId='1b0a95ea-b5ee-4827-93bc-eaef5fbab9ff'/>
          </div>
        )
      ) : (
        <p>User not found.</p> // Handle case where user is not found
      )}
    </div>
  );
}
