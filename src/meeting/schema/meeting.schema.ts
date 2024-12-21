import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'meetings' })
export class Meeting {
  constructor(data: Partial<Meeting>) {
    Object.assign(this, data);
  }

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ type: String })
  title: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, type: Number, default: 30 })
  duration: number;

  @Prop({ required: true, type: [String] })
  participants?: string[];

  @Prop({ type: String })
  transcript?: string;

  @Prop({ type: String })
  summary?: string;

  @Prop({ type: [String] })
  actionItems?: string[];
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
