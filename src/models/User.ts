import { Schema, model, Document } from 'mongoose';

interface RefreshToken {
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IUser extends Document {
  email: string;
  password: string;
  refreshTokens: RefreshToken[];
}

const RefreshTokenSchema = new Schema<RefreshToken>({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  refreshTokens: { type: [RefreshTokenSchema], default: [] }
}, { timestamps: true });

export default model<IUser>('User', UserSchema);
