import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

export type UserDocument = User & Document;

@Schema({ strict: false })
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: Date, default: new Date() })
  createdAt: Date;

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
