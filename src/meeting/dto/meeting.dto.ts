import { Expose } from 'class-transformer';
import { TaskDto } from 'src/task/dto';

export class MeetingDto {
  constructor(data: Partial<MeetingDto>) {
    Object.assign(this, data);

    this.participantsCount = data['participants']?.length || 0;

    delete this['participants'];
    delete this['actionItems'];
  }

  @Expose()
  userId: string;

  @Expose()
  title: string;

  @Expose()
  date: Date;

  @Expose()
  participantsCount: number;

  @Expose()
  transcript?: string;

  @Expose()
  summary?: string;

  @Expose()
  actionItems?: string[];

  @Expose()
  tasks: TaskDto[];
}
