import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GeneralStatsDto {
  @ApiProperty({ description: 'Total number of meetings' })
  @Expose()
  totalMeetings: number;

  @ApiProperty({
    description: 'Total number of participants across all meetings',
  })
  @Expose()
  totalParticipants: number;

  @ApiProperty({ description: 'Total duration of all meetings in minutes' })
  @Expose()
  totalDuration: number;

  @ApiProperty({ description: 'Duration of the shortest meeting in minutes' })
  @Expose()
  shortestMeeting: number;

  @ApiProperty({ description: 'Duration of the longest meeting in minutes' })
  @Expose()
  longestMeeting: number;

  @ApiProperty({
    description: 'Average number of participants across all meetings',
    type: 'number',
  })
  @Expose()
  @Transform(({ value }) => parseFloat(value.toFixed(2)))
  averageParticipants: number;

  @ApiProperty({
    description: 'Average duration of meetings in minutes',
    type: 'number',
  })
  @Expose()
  @Transform(({ value }) => parseFloat(value.toFixed(2)))
  averageDuration: number;
}

export class TopParticipantDto {
  @ApiProperty({ description: 'Participant identifier' })
  @Expose()
  participant: string;

  @ApiProperty({
    description: 'Number of meetings attended by the participant',
  })
  @Expose()
  meetingCount: number;
}

export class MeetingsByDayOfWeekDto {
  @ApiProperty({
    description: 'Day of the week (1 = Monday, 7 = Sunday)',
    type: 'number',
  })
  @Expose()
  dayOfWeek: number;

  @ApiProperty({ description: 'Number of meetings held on that day' })
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

  @ApiProperty({ description: 'General statistics about meetings' })
  @Expose()
  generalStats: GeneralStatsDto;

  @ApiProperty({
    description:
      'List of top participants based on the number of meetings attended',
    type: [TopParticipantDto],
  })
  @Expose()
  topParticipants: TopParticipantDto[];

  @ApiProperty({
    description: 'Number of meetings per day of the week',
    type: [MeetingsByDayOfWeekDto],
  })
  @Expose()
  meetingsByDayOfWeek: MeetingsByDayOfWeekDto[];
}
