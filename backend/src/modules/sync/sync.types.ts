export type SyncTopic = 'documents' | 'workflows' | 'notifications' | 'comments';

export interface SyncRequestOptions {
  since?: Date;
  limit?: number;
  topics?: SyncTopic[];
  userId?: string;
}

export interface SyncSnapshot {
  cursor: string;
  documents?: unknown[];
  workflows?: unknown[];
  notifications?: unknown[];
  comments?: unknown[];
}


