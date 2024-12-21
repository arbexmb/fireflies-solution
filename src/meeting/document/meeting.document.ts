import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting } from 'src/meeting/schema';

@Injectable()
export class MeetingDocument {
  constructor(
    @InjectModel('meetings') private readonly meetingModel: Model<Meeting>,
  ) {}

  async get(id: string): Promise<Meeting> {
    return this.meetingModel.findOne({ _id: id }).lean();
  }

  async getMany(userId: string): Promise<Meeting[]> {
    return this.meetingModel
      .find({ userId, date: { $gte: new Date() } })
      .sort({ date: 1 })
      .select('_id title date participants')
      .limit(5)
      .lean();
  }

  async create(meetingData: Partial<Meeting>): Promise<Meeting> {
    const newMeeting = new this.meetingModel(meetingData);
    const createdMeeting = await newMeeting.save();

    return createdMeeting.toObject();
  }
}
