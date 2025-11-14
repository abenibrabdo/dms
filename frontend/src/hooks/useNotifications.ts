import { useQuery } from '@tanstack/react-query';

import { apiClient } from '@services/apiClient';

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message?: string;
  createdAt: string;
  read?: boolean;
}

export const useNotifications = () => {
  return useQuery<NotificationItem[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications');
      return data.data;
    },
  });
};
