import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ strict: false })
export class Trip {
  _id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  user_id: string;

  @Prop()
  origin: string;

  @Prop()
  destination: string;

  @Prop()
  cost: number;

  @Prop()
  duration: number;

  @Prop()
  type: string;

  @Prop()
  display_name: string;

  @Prop()
  travelers_number?: number;

  @Prop()
  total_budget?: number;

  @Prop()
  currency?: string;

  @Prop({ type: Date, default: new Date() })
  created_at?: Date;

  @Prop({ type: Date, default: new Date() })
  updated_at?: Date;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({ user_id: 1 });
TripSchema.index({ destination: 1 });
TripSchema.index({ cost: 1 });
TripSchema.index({ duration: 1 });
