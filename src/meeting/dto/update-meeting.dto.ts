import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeetingDto {
  @ApiProperty({
    example: 'Updated summary of the meeting.',
    description: 'The updated summary for the meeting.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Expose()
  summary?: string;

  @ApiProperty({
    example: ['Action item 1', 'Action item 2'],
    description: 'A list of updated action items for the meeting.',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @Expose()
  actionItems?: string[];
}
