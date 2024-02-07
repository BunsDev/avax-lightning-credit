import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class Value {
  @Prop({ required: true })
  initial: number;

  @Prop({ required: true })
  final: number;

  @Prop({ required: true })
  current: number;
}

@Schema()
export class NTBt extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  balance: number;

  @Prop({ required: true, type: Value })
  value: Value;

  @Prop({ required: true })
  assetType: string;
}

export const NTBtSchema = SchemaFactory.createForClass(NTBt);
