export interface CreateCommentInput {
  documentId: string;
  message: string;
  mentions?: string[];
  authorId: string;
  authorName: string;
  attachments?: Array<{
    filename: string;
    storageKey: string;
    mimeType?: string | null;
    size?: number | null;
    fileUrl: string;
  }>;
}

export interface LockDocumentInput {
  documentId: string;
  userId: string;
}

