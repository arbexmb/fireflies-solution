import { Injectable } from '@nestjs/common';
import { CreateMeetingDto } from 'src/meeting/dto';
import { Meeting } from 'src/meeting/schema';
import { MeetingDocument } from 'src/meeting/document';

@Injectable()
export class CreateMeetingService {
  constructor(private readonly meetingDocument: MeetingDocument) {}

  async perform(
    userId: string,
    meetingParams: CreateMeetingDto,
  ): Promise<Meeting> {
    return this.meetingDocument.create({ userId, ...meetingParams });
  }
}
