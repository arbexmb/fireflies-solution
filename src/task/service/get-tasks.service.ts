import { Injectable } from '@nestjs/common';
import { TaskDocument } from 'src/task/document';
import { Task } from 'src/task/schema';

@Injectable()
export class GetTasksService {
  constructor(private readonly taskDocument: TaskDocument) {}

  async perform(userId: string): Promise<Task[]> {
    return this.taskDocument.getByUser(userId);
  }
}
