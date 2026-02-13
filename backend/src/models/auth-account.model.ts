import { Schema, model, Document, Types } from 'mongoose';

export interface IAuthAccount extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  password_hash: string;
  createdAt: Date;
  updatedAt: Date;
}

const authAccountSchema = new Schema<IAuthAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: 'auth_account' },
);

export const AuthAccount = model<IAuthAccount>('AuthAccount', authAccountSchema);
