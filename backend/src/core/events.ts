export const RealtimeChannels = {
  DOCUMENT_UPDATED: 'documents.updated',
  DOCUMENT_VERSION_ADDED: 'documents.version.added',
  WORKFLOW_UPDATED: 'workflows.updated',
  NOTIFICATION_CREATED: 'notifications.created',
  NOTIFICATION_READ: 'notifications.read',
  COMMENT_ADDED: 'documents.comment.added',
} as const;

export type RealtimeChannel = (typeof RealtimeChannels)[keyof typeof RealtimeChannels];

