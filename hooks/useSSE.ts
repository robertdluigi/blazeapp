import { useEffect, useState } from 'react';

interface Participant {
  id: string;
  userId: string;
  username: string;
  avatarUrl?: string;
  displayName?: string;
}

export default function useSSE(lobbyId: string | null) {
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    if (!lobbyId) return;

    const eventSource = new EventSource(`/api/lobby/stream?lobbyId=${lobbyId}`);

    // Handle the 'init' event: initialize the participants list
    eventSource.addEventListener('init', (event) => {
      const initialParticipants = JSON.parse(event.data);
      setParticipants(initialParticipants);
    });

    // Handle the 'update' event: update the participants list with added/removed participants
    eventSource.addEventListener('update', (event) => {
      const updatedParticipants = JSON.parse(event.data);
      setParticipants(updatedParticipants);
    });

    // Handle 'member-joined' event: add the new participant to the list
    eventSource.addEventListener('member-joined', (event) => {
      const newParticipant = JSON.parse(event.data);
      setParticipants((prevParticipants) => [...prevParticipants, newParticipant]);
    });

    // Handle 'member-left' event: remove the participant from the list
    eventSource.addEventListener('member-left', (event) => {
      const leavingParticipant = JSON.parse(event.data);
      setParticipants((prevParticipants) =>
        prevParticipants.filter((participant) => participant.userId !== leavingParticipant.userId)
      );
    });

    return () => {
      eventSource.close();
    };
  }, [lobbyId]);

  return participants;
}
