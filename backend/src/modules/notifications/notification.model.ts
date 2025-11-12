import { Schema, model, type Document, type Model } from 'mongoose';

export interface NotificationDocument extends Document {
  recipient: string;
  title: string;
  message: string;
  type: 'task' | 'workflow' | 'system' | 'reminder';
  status: 'unread' | 'read';
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    recipient: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['task', 'workflow', 'system', 'reminder'],
      default: 'system',
    },
    status: { type: String, enum: ['unread', 'read'], default: 'unread' },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const NotificationModel: Model<NotificationDocument> = model<NotificationDocument>(
  'Notification',
  NotificationSchema,
);

