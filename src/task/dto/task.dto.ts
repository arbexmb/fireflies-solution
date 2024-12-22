import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskStatusEnum } from 'src/task/enum';

export class TaskDto {
  constructor(data: Partial<TaskDto>) {
    Object.assign(this, data);
  }

  @ApiProperty({
    description: 'The user ID associated with the task',
    example: 'user10',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'The meeting ID associated with the task',
    example: 'meeting123',
  })
  @Expose()
  meetingId: string;

  @ApiProperty({
    description: 'The title of the task',
    example: 'Task 1',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'A detailed description of the task',
    example: 'This task involves summarizing the meeting minutes.',
  })
  @Expose()
  description: string;

  @ApiProperty({
    description: 'Due date of the task',
    example: '2024-08-10T14:00:00Z',
  })
  @Expose()
  dueDate: Date;

  @ApiProperty({
    description: 'The current status of the task',
    enum: TaskStatusEnum,
    example: TaskStatusEnum['in-progress'],
  })
  @Expose()
  status: TaskStatusEnum;
}
