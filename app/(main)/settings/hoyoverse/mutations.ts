import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addGenshinUID, removeGenshinUID, addHonkaiUID, removeHonkaiUID, addHoyolabTokens } from './actions';

export function useAddGenshinUID() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGenshinUID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useRemoveGenshinUID() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeGenshinUID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useAddHonkaiUID() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addHonkaiUID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useRemoveHonkaiUID() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeHonkaiUID,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}

export function useAddHoyolabTokens() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addHoyolabTokens,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userData'] });
    },
  });
}