import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting } from 'src/meeting/schema';
import { UpdateMeetingDto } from 'src/meeting/dto';

@Injectable()
export class MeetingDocument {
  constructor(
    @InjectModel('meetings') private readonly meetingModel: Model<Meeting>,
  ) {}

  async get(id: string): Promise<Meeting> {
    const [meeting] = await this.meetingModel.aggregate([
      { $match: { _id: new this.meetingModel.base.Types.ObjectId(id) } },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'meetingId',
          as: 'tasks',
        },
      },
      { $limit: 1 },
    ]);

    return meeting;
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

  async update(id: string, partialData: UpdateMeetingDto): Promise<void> {
    await this.meetingModel.findByIdAndUpdate(
      id,
      { $set: partialData },
      { new: true, lean: true },
    );
  }
}
