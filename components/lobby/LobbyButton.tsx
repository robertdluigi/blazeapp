'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Gamepad2Icon } from 'lucide-react';

const LobbyButton: React.FC = () => {
  const router = useRouter();

  // Function to navigate to the lobby creation page
  const navigateToLobby = () => {
    router.push('/lobby');  // Adjust the route to your actual lobby creation page path
  };

  return (
    <Button onClick={navigateToLobby} className="lobby-button" variant={'outline'}>
      <Gamepad2Icon />
    </Button>
  );
};

export default LobbyButton;