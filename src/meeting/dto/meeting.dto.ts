import { Expose } from 'class-transformer';
import { TaskDto } from 'src/task/dto';
import { ApiProperty } from '@nestjs/swagger';

export class MeetingDto {
  constructor(data: Partial<MeetingDto>) {
    Object.assign(this, data);

    this.participantsCount = data['participants']?.length || 0;

    delete this['participants'];
    delete this['actionItems'];
  }

  @ApiProperty({
    example: 'user10',
    description: 'ID of the user who owns the meeting',
  })
  @Expose()
  userId: string;

  @ApiProperty({ example: 'Meeting 1', description: 'Title of the meeting' })
  @Expose()
  title: string;

  @ApiProperty({
    example: '2024-08-06T19:45:47.412Z',
    description: 'Date and time of the meeting',
    format: 'date-time',
  })
  @Expose()
  date: Date;

  @ApiProperty({
    example: 2,
    description: 'Number of participants in the meeting',
  })
  @Expose()
  participantsCount: number;

  @ApiProperty({
    example: 'This is a sample transcript for meeting 1.',
    description: 'Transcript of the meeting',
    required: false,
  })
  @Expose()
  transcript?: string;

  @ApiProperty({
    example: 'Summary of meeting 1',
    description: 'Summary of the meeting',
    required: false,
  })
  @Expose()
  summary?: string;

  @ApiProperty({
    example: ['Review notes'],
    description: 'List of action items',
    required: false,
  })
  @Expose()
  actionItems?: string[];

  @ApiProperty({
    type: [TaskDto],
    description: 'List of tasks associated with the meeting',
  })
  @Expose()
  tasks: TaskDto[];
}
