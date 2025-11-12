import { model, Schema, type Document, type Model } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
  roles: string[];
  permissions: string[];
  isMfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, unique: true, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    department: { type: String },
    roles: { type: [String], default: ['user'] },
    permissions: { type: [String], default: [] },
    isMfaEnabled: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);

