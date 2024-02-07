import { Document } from 'mongoose';

export interface INTBt extends Document {
  _id: string;
  name: string;
  address: string;
  balance: number;
  value: {
    initial: number;
    final: number;
    current: number;
  };
  assetType: string;
}
