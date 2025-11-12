export interface CreateNotificationInput {
  recipient: string;
  title: string;
  message: string;
  type?: 'task' | 'workflow' | 'system' | 'reminder';
  metadata?: Record<string, unknown>;
}

