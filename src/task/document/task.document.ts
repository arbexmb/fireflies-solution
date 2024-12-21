import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from 'src/task/schema';

@Injectable()
export class TaskDocument {
  constructor(@InjectModel('tasks') private readonly taskModel: Model<Task>) {}

  async createMany(tasks: Partial<Task>[]): Promise<Task[]> {
    const createdTasks = await this.taskModel.insertMany(tasks);

    return createdTasks.map((createdTask) => createdTask.toObject());
  }

  async deleteTasks(meetingId: string): Promise<void> {
    await this.taskModel.deleteMany({ meetingId });
  }
}
