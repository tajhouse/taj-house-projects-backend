import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {

  _id?: Types.ObjectId;

  @Prop({
    required: true,
    trim: true,
    maxlength: 100
  })
  name: string;

  @Prop({
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  })
  email: string;

  @Prop({
    required: true,
    trim: true,
    maxlength: 20
  })
  phone: string;

  @Prop({
    required: false,
    trim: true,
    maxlength: 200
  })
  requestedService?: string;

  @Prop({
    required: false,
    maxlength: 1000
  })
  notes?: string;

  @Prop({
    default: 'pending',
    enum: ['pending', 'in-progress', 'completed', 'cancelled']
  })
  status: string;

  @Prop({
    default: false
  })
  isRead: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);

ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ isRead: 1 });
ContactSchema.index({ createdAt: -1 });
