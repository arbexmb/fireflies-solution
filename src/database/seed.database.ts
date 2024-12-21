import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { MeetingSchema } from 'src/meeting/schema';
import { TaskSchema } from 'src/task/schema';
import { TaskStatusEnum } from 'src/meeting/enum';

dotenv.config();

export class MongoDBSeed {
  private readonly logger = new Logger(MongoDBSeed.name);
  private MeetingModel = mongoose.model('Meeting', MeetingSchema);
  private TaskModel = mongoose.model('Task', TaskSchema);
  private readonly users = ['user1', 'user2', 'user3', 'user4', 'user5'];
  private readonly participants = [
    'Alice',
    'Bob',
    'Charlie',
    'David',
    'Eva',
    'Frank',
    'Grace',
    'Henry',
    'Ivy',
    'Jack',
  ];

  constructor() {
    mongoose.connect(process.env.MONGO_DATABASE_URL);
  }

  async run() {
    await this.before();

    await this.seedMeetings();
    await this.seedTasks();

    await this.after();

    this.logger.log('Seed process completed!');
  }

  private async before() {
    this.logger.log('Dropping the database...');
    await mongoose.connection.dropDatabase();
    this.logger.log('Database dropped successfully.');
  }

  private async after() {
    await mongoose.disconnect();
  }

  private async seedMeetings() {
    const meetings = [];

    for (let i = 0; i < 100; i++) {
      const userId = this.users[Math.floor(Math.random() * this.users.length)];
      const meeting = new this.MeetingModel({
        userId: userId,
        title: `Meeting ${i + 1}`,
        date: this.randomDate(new Date(2023, 0, 1), new Date()),
        participants: this.randomParticipants(),
        transcript: `This is a sample transcript for meeting ${i + 1}.`,
        summary: `Summary of meeting ${i + 1}`,
        actionItems: [
          `Action item 1 for meeting ${i + 1}`,
          `Action item 2 for meeting ${i + 1}`,
        ],
      });
      meetings.push(meeting);
    }

    await this.MeetingModel.insertMany(meetings);
    this.logger.log('Meetings seeded successfully');
  }

  async seedTasks() {
    const meetings = await this.MeetingModel.find();
    const tasks = [];

    for (const meeting of meetings) {
      const taskCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 tasks per meeting
      for (let i = 0; i < taskCount; i++) {
        const task = new this.TaskModel({
          meetingId: meeting._id,
          userId: meeting.userId,
          title: `Task ${i + 1} from ${meeting.title}`,
          description: `This is a sample task from meeting ${meeting.title}`,
          status: [
            TaskStatusEnum.pending,
            TaskStatusEnum['in-progress'],
            TaskStatusEnum.completed,
          ][Math.floor(Math.random() * 3)],
          dueDate: new Date(
            meeting.date.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000,
          ), // Random date within a week of the meeting
        });
        tasks.push(task);
      }
    }

    await this.TaskModel.insertMany(tasks);
    this.logger.log('Tasks seeded successfully');
  }

  private randomDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  private randomParticipants(): string[] {
    const count = Math.floor(Math.random() * 5) + 2; // 2 to 6 participants
    return this.participants.sort(() => 0.5 - Math.random()).slice(0, count);
  }
}

new MongoDBSeed().run();
