export interface DocumentSummary {
  id: string;
  title: string;
  type: string;
  owner: string;
  status: 'draft' | 'in-review' | 'approved' | 'archived';
  updatedAt: string;
}

export interface DocumentDetail extends DocumentSummary {
  department?: string;
  tags: string[];
  currentVersion: number;
  versions: {
    versionNumber: number;
    filename: string;
    createdAt: string;
    createdBy: string;
  }[];
}

