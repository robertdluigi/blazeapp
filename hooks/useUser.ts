import { useQuery } from '@tanstack/react-query';
import ky from '@/lib/ky';
import { UserData } from '@/lib/types';

export function useUser() {
  const { data: user, isLoading, error } = useQuery<UserData>({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await ky.get('/api/user').json<UserData>();
        return response;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    user,
    isLoading,
    error,
  };
}