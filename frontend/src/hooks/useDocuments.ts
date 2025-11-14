import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@services/apiClient';
import type { DocumentSummary } from '@types/document';

type ManagedDocument = {
  id: string;
  metadata: {
    title: string;
    type: string;
    owner: string;
    status: 'draft' | 'in-review' | 'approved' | 'archived';
  };
  updatedAt: string;
};

export const useDocuments = () => {
  return useQuery<DocumentSummary[]>({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data } = await apiClient.get('/documents');
      const docs: ManagedDocument[] = data.data;
      return docs.map((d) => ({
        id: d.id,
        title: d.metadata.title,
        type: d.metadata.type,
        owner: d.metadata.owner,
        status: d.metadata.status,
        updatedAt: d.updatedAt,
      }));
    },
  });
};

