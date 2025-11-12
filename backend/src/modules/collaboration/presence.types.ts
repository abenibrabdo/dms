import type { PresenceStatus } from './presence.model.js';

export interface JoinPresenceInput {
  documentId: string;
  userId: string;
  userName?: string;
  status: PresenceStatus;
  deviceInfo?: Record<string, unknown>;
  capabilities?: string[];
}

export interface UpdatePresenceInput {
  sessionId: string;
  status?: PresenceStatus;
  userName?: string;
  deviceInfo?: Record<string, unknown>;
  capabilities?: string[];
}


