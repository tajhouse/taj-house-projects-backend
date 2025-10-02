import { IsString, IsNotEmpty } from 'class-validator';

export class MultilingualFieldDto {
  @IsString()
  @IsNotEmpty()
  en: string;

  @IsString()
  @IsNotEmpty()
  ar: string;
}
