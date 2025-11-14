import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@services/apiClient';

export interface PresenceSession {
  id: string;
  status: 'viewing' | 'editing' | 'idle';
  userName?: string;
  deviceInfo?: any;
  capabilities?: string[];
  updatedAt: string;
}

export const usePresence = (documentId: string) => {
  return useQuery<PresenceSession[]>({
    queryKey: ['presence', documentId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/collaboration/${encodeURIComponent(documentId)}/presence`);
      return data.data as PresenceSession[];
    },
  });
};
