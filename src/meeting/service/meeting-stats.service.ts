import { Injectable } from '@nestjs/common';
import { MeetingDocument } from 'src/meeting/document';
import { MeetingStatsDto } from 'src/meeting/dto';

@Injectable()
export class MeetingStatsService {
  constructor(private readonly meetingDocument: MeetingDocument) {}

  async perform(): Promise<MeetingStatsDto> {
    const [generalStats, topParticipants, meetingsByDayOfWeek] =
      await Promise.all([
        this.meetingDocument.getGeneralStats(),
        this.meetingDocument.getTopParticipants(),
        this.meetingDocument.getMeetingsByDayOfWeek(),
      ]);

    return new MeetingStatsDto(
      generalStats,
      topParticipants,
      meetingsByDayOfWeek,
    );
  }
}
