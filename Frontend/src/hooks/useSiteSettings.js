import { useQuery } from '@tanstack/react-query';
import { publicApi } from '../api/publicApi.js';

export function useSiteSettings() {
  return useQuery({
    queryKey: ['public', 'settings'],
    queryFn: publicApi.getSettings,
    staleTime: 5 * 60 * 1000,
  });
}
