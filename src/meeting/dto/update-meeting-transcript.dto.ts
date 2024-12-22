import { Expose } from 'class-transformer';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeetingTranscriptDto {
  @ApiProperty({
    example: 'Updated transcript content for the meeting.',
    description: 'The updated transcript for the meeting.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @Expose()
  transcript: string;
}
