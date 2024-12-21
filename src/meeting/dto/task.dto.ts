import { Expose } from 'class-transformer';

export class TaskDto {
  constructor(data: Partial<TaskDto>) {
    Object.assign(this, data);
  }

  @Expose()
  _id: string;

  @Expose()
  meetingId: string;

  @Expose()
  userId: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  dueDate: Date;
}
