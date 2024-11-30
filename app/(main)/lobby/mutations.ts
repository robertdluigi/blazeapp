import { QueryFilters, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { createLobby } from './actions'; // Import fetchLobbyByInviteCode
import { Lobby, CreateLobbyInput, JoinLobbyInput } from '@/lib/types';

// Define the custom hook for creating a lobby
export function useCreateLobby(): UseMutationResult<Lobby, Error, CreateLobbyInput> {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation<Lobby, Error, CreateLobbyInput>({
    mutationFn: createLobby,
    onSuccess: (newLobby) => {
      const queryKey = ['lobbies', newLobby.userId];
      const queryFilters: QueryFilters = {
        queryKey, // You can provide queryKey here to filter queries by key
      };
      // Invalidate cache or refetch queries if necessary
      queryClient.invalidateQueries(queryFilters);
      
      // Show a success toast notification
      toast({
        description: 'Lobby created successfully!',
        variant: 'default', // Optional, based on your toast setup
      });
    },
    onError: (error) => {
      // Handle error case by showing an error toast
      toast({
        title: 'Error',
        description: `Failed to create lobby: ${error.message}`,
        variant: 'destructive', // Optional, depending on your toast setup
      });
    },
  });
}
