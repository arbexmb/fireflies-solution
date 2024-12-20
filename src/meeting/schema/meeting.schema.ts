import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'meetings' })
class Meeting {
  constructor(data: Partial<Meeting>) {
    Object.assign(this, data);
  }

  @Prop({ required: true, type: String })
  userId: string;

  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: Date })
  date: Date;

  @Prop({ required: true, type: [String] })
  participants: string[];

  @Prop({ required: true, type: String })
  transcript: string;

  @Prop({ required: true, type: String })
  summary: string;

  @Prop({ required: true, type: [String] })
  actionItems: string[];
}

export const MeetingSchema = SchemaFactory.createForClass(Meeting);
