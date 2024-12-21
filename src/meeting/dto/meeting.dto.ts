import { Expose } from 'class-transformer';

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
}
