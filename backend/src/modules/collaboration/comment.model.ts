import { Schema, model, type Document, type Model } from 'mongoose';

export interface CommentDocument extends Document {
  documentId: string;
  authorId: string;
  authorName: string;
  message: string;
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<CommentDocument>(
  {
    documentId: { type: String, required: true, index: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    message: { type: String, required: true },
    mentions: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const CommentModel: Model<CommentDocument> = model<CommentDocument>('Comment', CommentSchema);

