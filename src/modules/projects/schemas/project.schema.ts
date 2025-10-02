import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import type { MultilingualField } from '../../../types/multilingual.types';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({
    type: {
      en: { type: String, required: true, trim: true, maxlength: 200 },
      ar: { type: String, required: true, trim: true, maxlength: 200 }
    },
    required: true
  })
  title: MultilingualField;

  @Prop({
    type: {
      en: { type: String, required: false, maxlength: 2000 },
      ar: { type: String, required: false, maxlength: 2000 }
    },
    required: false
  })
  description?: MultilingualField;

  @Prop({
    required: true,
    maxlength: 500
  })
  image: string;

  @Prop({
    required: false,
    validate: {
      validator: function (v: string) {
        if (!v) return true;
        return /^https?:\/\/.+/.test(v);
      },
      message: 'The link must be valid and start with http or https'
    }
  })
  projectUrl?: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
    message: 'The specified classification does not exist.'
  })
  categoryId: Types.ObjectId;

  @Prop({
    default: true
  })
  isActive: boolean;


}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({ categoryId: 1 });
ProjectSchema.index({ isActive: 1 });
ProjectSchema.index({ 'title.en': 'text', 'title.ar': 'text', 'description.en': 'text', 'description.ar': 'text' });
ProjectSchema.index({ createdAt: -1 });

