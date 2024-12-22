import { Injectable } from '@nestjs/common';
import { MeetingDocument } from 'src/meeting/document';
import { UpdateMeetingTranscriptDto } from 'src/meeting/dto';
import { MeetingError } from 'src/meeting/error';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UpdateMeetingService {
  constructor(private readonly meetingDocument: MeetingDocument) {}

  async perform(
    userId: string,
    id: string,
    updateParams: UpdateMeetingTranscriptDto,
  ): Promise<void> {
    const meeting = await this.meetingDocument.get(id);

    if (!meeting) throw MeetingError.MEETING_NOT_FOUND;
    if (meeting.userId !== userId) throw MeetingError.FORBIDDEN_ACTION;

    await this.meetingDocument.update(
      id,
      plainToInstance(UpdateMeetingTranscriptDto, updateParams, {
        exposeUnsetFields: false,
      }),
    );
  }
}
