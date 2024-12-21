import { Expose, Transform } from 'class-transformer';

export class GeneralStatsDto {
  @Expose()
  totalMeetings: number;

  @Expose()
  totalParticipants: number;

  @Expose()
  totalDuration: number;

  @Expose()
  shortestMeeting: number;

  @Expose()
  longestMeeting: number;

  @Expose()
  @Transform(({ value }) => parseFloat(value.toFixed(2)), { toPlainOnly: true })
  averageParticipants: number;

  @Expose()
  @Transform(({ value }) => parseFloat(value.toFixed(2)), { toPlainOnly: true })
  averageDuration: number;
}

export class TopParticipantDto {
  @Expose()
  participant: string;

  @Expose()
  meetingCount: number;
}

export class MeetingsByDayOfWeekDto {
  @Expose()
  dayOfWeek: number;

  @Expose()
  count: number;
}

export class MeetingStatsDto {
  constructor(
    generalStats: GeneralStatsDto,
    topParticipants: TopParticipantDto[],
    meetingsByDayOfWeek: MeetingsByDayOfWeekDto[],
  ) {
    this.generalStats = generalStats;
    this.topParticipants = topParticipants;
    this.meetingsByDayOfWeek = meetingsByDayOfWeek;
  }

  @Expose()
  generalStats: GeneralStatsDto;

  @Expose()
  topParticipants: TopParticipantDto[];

  @Expose()
  meetingsByDayOfWeek: MeetingsByDayOfWeekDto[];
}
