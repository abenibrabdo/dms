import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@services/apiClient';
import type { DocumentSummary } from '@types/document';

export const useDocuments = () => {
  return useQuery<DocumentSummary[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/documents');
      return data.data;
    },
  });
};

