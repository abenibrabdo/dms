export interface CreateDocumentInput {
  title: string;
  type: string;
  category?: string;
  owner: string;
  department?: string;
  tags?: string[];
  status?: 'draft' | 'in-review' | 'approved' | 'archived';
  filename: string;
  storageKey: string;
  size?: number;
  checksum?: string;
  mimeType?: string;
}

export interface UpdateDocumentMetadataInput {
  title?: string;
  category?: string;
  department?: string;
  tags?: string[];
  status?: 'draft' | 'in-review' | 'approved' | 'archived';
}

export interface AddDocumentVersionInput {
  documentId: string;
  filename: string;
  storageKey: string;
  size?: number;
  checksum?: string;
  createdBy: string;
  mimeType?: string;
}

