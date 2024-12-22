import { Expose } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingDto {
  @ApiProperty({
    example: 'Team Sync',
    description: 'The title of the meeting.',
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  title: string;

  @ApiProperty({
    example: '2024-08-06T19:45:47.412Z',
    description: 'The date and time of the meeting.',
    format: 'date-time',
  })
  @IsNotEmpty()
  @Expose()
  date: Date;

  @ApiProperty({
    example: ['user1', 'user2', 'user3'],
    description: 'An array of participant user IDs.',
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @Expose()
  participants: string[];

  @ApiProperty({
    example: 60,
    description:
      'The duration of the meeting in minutes. Defaults to 30 if not provided',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Expose()
  duration?: number;
}
