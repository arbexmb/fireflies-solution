import { Expose } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMeetingDto {
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @IsNotEmpty()
  @Expose()
  date: Date;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @Expose()
  participants: string[];

  @IsOptional()
  @IsNumber()
  @Expose()
  duration?: number;
}
