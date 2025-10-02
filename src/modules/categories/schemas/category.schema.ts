import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { MultilingualField } from '../../../types/multilingual.types';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({
    type: {
      en: { type: String, required: true, trim: true, maxlength: 100 },
      ar: { type: String, required: true, trim: true, maxlength: 100 }
    },
    required: true,
    unique: true
  })
  name: MultilingualField;

  @Prop({
    type: {
      en: { type: String, required: false, maxlength: 500 },
      ar: { type: String, required: false, maxlength: 500 }
    },
    required: false
  })
  description?: MultilingualField;

  @Prop({
    default: true
  })
  isActive: boolean;


}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ 'name.en': 1 });
CategorySchema.index({ 'name.ar': 1 });
CategorySchema.index({ isActive: 1 });