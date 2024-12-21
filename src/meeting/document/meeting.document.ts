import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Meeting } from 'src/meeting/schema';
import {
  GeneralStatsDto,
  MeetingsByDayOfWeekDto,
  TopParticipantDto,
} from 'src/meeting/dto';
import { plainToInstance } from 'class-transformer';

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
    return this.meetingModel.find({ userId }).lean();
  }

  async create(meetingData: Partial<Meeting>): Promise<Meeting> {
    const newMeeting = new this.meetingModel(meetingData);
    const createdMeeting = await newMeeting.save();

    return createdMeeting.toObject();
  }

  async update(id: string, partialData: any): Promise<void> {
    console.log({ partialData });
    await this.meetingModel.findByIdAndUpdate(
      id,
      { $set: partialData },
      { new: true, lean: true },
    );
  }

  async getGeneralStats(): Promise<GeneralStatsDto> {
    const [generalStats] = await this.meetingModel.aggregate([
      {
        $group: {
          _id: null,
          totalMeetings: { $sum: 1 },
          totalParticipants: {
            $sum: { $size: { $ifNull: ['$participants', []] } },
          },
          totalDuration: {
            $sum: { $ifNull: ['$duration', 0] },
          },
          shortestMeeting: {
            $min: { $ifNull: ['$duration', 0] },
          },
          longestMeeting: {
            $max: { $ifNull: ['$duration', 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalMeetings: 1,
          totalParticipants: 1,
          totalDuration: 1,
          averageParticipants: {
            $divide: ['$totalParticipants', '$totalMeetings'],
          },
          shortestMeeting: 1,
          longestMeeting: 1,
          averageDuration: {
            $divide: ['$totalDuration', '$totalMeetings'],
          },
        },
      },
    ]);

    return plainToInstance(GeneralStatsDto, generalStats);
  }

  async getTopParticipants(): Promise<TopParticipantDto[]> {
    return this.meetingModel.aggregate([
      { $unwind: { path: '$participants', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$participants',
          meetingCount: { $sum: 1 },
        },
      },
      { $sort: { meetingCount: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, participant: '$_id', meetingCount: 1 } },
    ]);
  }

  async getMeetingsByDayOfWeek(): Promise<MeetingsByDayOfWeekDto[]> {
    return this.meetingModel.aggregate([
      {
        $addFields: {
          dayOfWeek: { $dayOfWeek: '$date' },
        },
      },
      {
        $group: {
          _id: '$dayOfWeek',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          dayOfWeek: '$_id',
          count: 1,
          _id: 0,
        },
      },
      { $sort: { dayOfWeek: 1 } },
    ]);
  }
}
