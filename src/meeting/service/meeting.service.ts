import { Injectable } from '@nestjs/common';
import { MeetingDocument } from 'src/meeting/document';
import { Meeting } from 'src/meeting/schema';
import { CreateMeetingDto, UpdateMeetingDto } from 'src/meeting/dto';
import { MeetingError } from 'src/meeting/error';

@Injectable()
export class MeetingService {
  constructor(private readonly meetingDocument: MeetingDocument) {}

  async get(id: string): Promise<Meeting> {
    const meeting = await this.meetingDocument.get(id);

    if (!meeting) throw MeetingError.MEETING_NOT_FOUND;

    return meeting;
  }

  async getMany(userId: string): Promise<Meeting[]> {
    const meetings = await this.meetingDocument.getMany(userId);

    if (!meetings.length) throw MeetingError.MEETING_NOT_FOUND;

    return meetings;
  }

  async create(
    userId: string,
    meetingParams: CreateMeetingDto,
  ): Promise<Meeting> {
    return this.meetingDocument.create({ userId, ...meetingParams });
  }

  async update(
    userId: string,
    id: string,
    updateParams: UpdateMeetingDto,
  ): Promise<void> {
    const meeting = await this.meetingDocument.get(id);

    if (!meeting) throw MeetingError.MEETING_NOT_FOUND;
    if (meeting.userId !== userId) throw MeetingError.FORBIDDEN_ACTION;

    await this.meetingDocument.update(id, updateParams);
  }
}
