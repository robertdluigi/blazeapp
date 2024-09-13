import { QueryFilters, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { createSection } from './actions'; // Adjust path as needed
import { ProfileSection } from '@/lib/types';

export function useCreateSection(): UseMutationResult<ProfileSection, Error, Omit<ProfileSection, 'id' | 'createdAt' | 'updatedAt'>> {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation<ProfileSection, Error, Omit<ProfileSection, 'id' | 'createdAt' | 'updatedAt'>>({
        mutationFn: createSection,
        onSuccess: (newSection) => {
            const queryKey = ['profileSections', newSection.userId];  
            const queryFilters: QueryFilters = {
                queryKey, // You can provide queryKey here to filter queries by key
            };
            
            // Cancel any ongoing queries for this query key
            queryClient.cancelQueries(queryFilters);

            // Update the cache with the new section
            queryClient.setQueryData<ProfileSection[]>(queryKey, (oldData) => {
                return oldData ? [newSection, ...oldData] : [newSection];
            });

            // Optionally, you can refetch the data to ensure consistency
            queryClient.invalidateQueries(queryFilters);

            // Show success toast
            toast({
                description: 'Section created successfully!',
            });
        },
        onError: (error) => {
            // Show error toast
            toast({
                variant: 'destructive',
                description: `Failed to create section: ${error.message}`,
            });
        },
    });
}
