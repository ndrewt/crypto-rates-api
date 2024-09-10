import { Schema, Document } from 'mongoose';

export interface RateInterface extends Document {
  symbolA: string;
  symbolB: string;
  rate: number;
  timestamp: Date;
  isCorrect: boolean;
}

export const RateSchema = new Schema({
  symbolA: String,
  symbolB: String,
  binancePair: String,
  pairAddressUni: String,
  timestamp: Number,
  rate: Number,
  isCorrect: Boolean,
});
