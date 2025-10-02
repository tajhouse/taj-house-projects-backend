import { IsString, IsEmail, IsOptional, MaxLength, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateContactDto {
  @IsString()
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsEmail({}, { message: 'Please enter a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @MaxLength(20, { message: 'Phone number must not exceed 20 characters' })
  @Transform(({ value }) => value?.trim())
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Requested service must not exceed 200 characters' })
  @Transform(({ value }) => value?.trim())
  requestedService?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
  @Transform(({ value }) => value?.trim())
  notes?: string;
}
