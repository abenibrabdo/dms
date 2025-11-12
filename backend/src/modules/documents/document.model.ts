import { Schema, model, type Document, type Model } from 'mongoose';

export interface DocumentVersion {
  versionNumber: number;
  filename: string;
  storageKey: string;
  mimeType?: string;
  createdAt: Date;
  createdBy: string;
  checksum?: string;
  size?: number;
}

export interface DocumentMetadata {
  title: string;
  type: string;
  category?: string;
  owner: string;
  department?: string;
  tags: string[];
  status: 'draft' | 'in-review' | 'approved' | 'archived';
}

export interface ManagedDocument extends Document {
  metadata: DocumentMetadata;
  versions: DocumentVersion[];
  currentVersion: number;
  isLocked: boolean;
  lockOwner?: string;
  favoriteBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VersionSchema = new Schema<DocumentVersion>(
  {
    versionNumber: { type: Number, required: true },
    filename: { type: String, required: true },
    storageKey: { type: String, required: true },
    mimeType: { type: String },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true },
    checksum: { type: String },
    size: { type: Number },
  },
  { _id: false },
);

const DocumentSchema = new Schema<ManagedDocument>(
  {
    metadata: {
      title: { type: String, required: true },
      type: { type: String, required: true },
      category: { type: String },
      owner: { type: String, required: true },
      department: { type: String },
      tags: { type: [String], default: [] },
      status: { type: String, enum: ['draft', 'in-review', 'approved', 'archived'], default: 'draft' },
    },
    versions: { type: [VersionSchema], default: [] },
    currentVersion: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockOwner: { type: String },
    favoriteBy: { type: [String], default: [] },
  },
  { timestamps: true },
);

DocumentSchema.index({ 'metadata.title': 'text', 'metadata.tags': 'text' });

export const DocumentModel: Model<ManagedDocument> = model<ManagedDocument>('Document', DocumentSchema);

