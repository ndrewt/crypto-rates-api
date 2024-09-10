import { Schema, Document } from 'mongoose';

export interface WhiteListInterface extends Document {
  symbolA: string;
  symbolB: string;
  createdAt: Date;
}

export const WhiteListSchema = new Schema({
  symbolA: String,
  symbolB: String,
  createdAt: { type: Date, default: new Date() },
});
