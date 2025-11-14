import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';

export interface CommentItem {
  id: string;
  message: string;
  authorName?: string;
  createdAt: string;
}

export const useComments = (documentId: string) => {
  return useQuery<CommentItem[]>({
    queryKey: ['comments', documentId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/collaboration/${encodeURIComponent(documentId)}/comments`);
      return (data.data as any[]).map((c) => ({
        id: c.id,
        message: c.message,
        authorName: c.authorName,
        createdAt: c.createdAt,
      }));
    },
  });
};
