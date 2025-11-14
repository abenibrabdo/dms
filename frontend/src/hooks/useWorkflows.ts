import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@services/apiClient';

export const useWorkflows = () => {
  return useQuery<any[]>({
    queryKey: ['workflows'],
    queryFn: async () => {
      const { data } = await apiClient.get('/workflows');
      return data.data;
    },
  });
};
