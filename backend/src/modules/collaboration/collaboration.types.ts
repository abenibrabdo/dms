export interface CreateCommentInput {
  documentId: string;
  message: string;
  mentions?: string[];
  authorId: string;
  authorName: string;
}

export interface LockDocumentInput {
  documentId: string;
  userId: string;
}

