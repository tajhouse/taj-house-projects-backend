import { IsString, IsOptional, IsBoolean, IsNumber, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import type { MultilingualField } from '../../../types/multilingual.types';
import { MultilingualFieldDto } from '../../../dto/multilingual-field.dto';

export class CreateCategoryDto {
  @IsObject()
  @ValidateNested()
  @Type(() => MultilingualFieldDto)
  name: MultilingualField;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => MultilingualFieldDto)
  description?: MultilingualField;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

}
