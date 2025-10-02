import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';

export class UpdateContactStatusDto {
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in-progress', 'completed', 'cancelled'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  isRead?: boolean;
}
