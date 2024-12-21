import { Expose } from 'class-transformer';
import { TaskStatusEnum } from 'src/task/enum';

export class TaskDto {
  constructor(data: Partial<TaskDto>) {
    Object.assign(this, data);
  }

  @Expose()
  userId: string;

  @Expose()
  meetingId: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  dueDate: Date;

  @Expose()
  status: TaskStatusEnum;
}
