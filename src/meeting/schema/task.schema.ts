import { Schema as MongooseSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskStatusEnum } from 'src/meeting/enum';

@Schema({ collection: 'tasks' })
class Task {
  constructor(data: Partial<Task>) {
    Object.assign(this, data);
  }

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Meeting' })
  meetingId: string;

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: String, enum: Object.values(TaskStatusEnum) })
  status: TaskStatusEnum;

  @Prop({ required: true, type: Date })
  dueDate: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
