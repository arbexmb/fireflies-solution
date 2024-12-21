import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMeetingDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  transcript?: string;

  @Expose()
  summary?: string;

  @Expose()
  actionItems?: string[];
}
