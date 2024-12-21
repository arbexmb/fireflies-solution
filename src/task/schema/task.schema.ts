import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatusEnum } from 'src/meeting/enum';

@Schema({ collection: 'tasks' })
export class Task {
  constructor(data: Partial<Task>) {
    Object.assign(this, data);
  }

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Meeting' })
  meetingId: string;

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({
    required: true,
    type: String,
    default: function (this: Task) {
      return this.title;
    },
  })
  description: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(TaskStatusEnum),
    default: TaskStatusEnum['in-progress'],
  })
  status: TaskStatusEnum;

  @Prop({
    required: true,
    type: Date,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })
  dueDate: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);