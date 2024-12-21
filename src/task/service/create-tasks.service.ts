import { Injectable } from '@nestjs/common';
import { TaskDocument } from 'src/task/document';

@Injectable()
export class CreateTasksService {
  constructor(private readonly taskDocument: TaskDocument) {}

  async perform(
    userId: string,
    meetingId: string,
    titles: string[],
  ): Promise<void> {
    if (!titles) return;

    // TO-DO: add transaction, in order to rollback if something goes wrong

    await this.taskDocument.deleteTasks(meetingId);

    const tasks = titles.map((title) => ({
      userId,
      meetingId,
      title,
    }));

    await this.taskDocument.createMany(tasks);
  }
}
