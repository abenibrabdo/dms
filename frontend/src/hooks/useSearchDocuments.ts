import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@services/apiClient';
import type { DocumentSummary } from '@types/document';

export const useSearchDocuments = (params: { q?: string; owner?: string; type?: string; status?: string; limit?: number }) => {
  return useQuery<DocumentSummary[]>({
    queryKey: ['search-documents', params],
    queryFn: async () => {
      const { data } = await apiClient.get('/search/documents', { params });
      const docs = data.data as any[];
      return docs.map((d) => ({
        id: d.id,
        title: d.metadata.title,
        type: d.metadata.type,
        owner: d.metadata.owner,
        status: d.metadata.status,
        updatedAt: d.updatedAt,
      }));
    },
    enabled: !!params.q || !!params.owner || !!params.type || !!params.status,
  });
};
