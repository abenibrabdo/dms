import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@services/apiClient';
import type { DocumentDetail } from '@types/document';

export const useDocument = (documentId: string) => {
  return useQuery<DocumentDetail>({
    queryKey: ['document', documentId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/documents/${encodeURIComponent(documentId)}`);
      const d = data.data as any;
      const detail: DocumentDetail = {
        id: d.id,
        title: d.metadata?.title ?? '',
        type: d.metadata?.type ?? '',
        owner: d.metadata?.owner ?? '',
        status: d.metadata?.status ?? 'draft',
        updatedAt: d.updatedAt,
        department: d.metadata?.department,
        tags: d.metadata?.tags ?? [],
        currentVersion: d.currentVersion ?? (d.versions?.[0]?.versionNumber ?? 1),
        versions: (d.versions ?? []).map((v: any) => ({
          versionNumber: v.versionNumber,
          filename: v.filename,
          createdAt: v.createdAt,
          createdBy: v.createdBy,
        })),
      };
      return detail;
    },
  });
};
