import { IsString, IsOptional, IsMongoId, IsBoolean, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';
import type { MultilingualField } from '../../../types/multilingual.types';
import { MultilingualFieldDto } from '../../../dto/multilingual-field.dto';

export class CreateProjectDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualFieldDto)
  title: MultilingualField;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MultilingualFieldDto)
  description?: MultilingualField;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  projectUrl?: string;

  @IsMongoId()
  categoryId: Types.ObjectId;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}