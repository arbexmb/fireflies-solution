import { Injectable, Logger } from '@nestjs/common';
import { Meeting } from 'src/meeting/schema';
import { MeetingDocument } from 'src/meeting/document';
import { MeetingError } from 'src/meeting/error';

interface MeetingSummary {
  summary: string;
  actionItems: string[];
}

@Injectable()
export class SummarizeMeetingService {
  private logger = new Logger(SummarizeMeetingService.name);
  private mockSummaries = [
    'Discussed project timelines and milestones',
    'Reviewed quarterly budget and allocations',
    'Brainstormed ideas for the upcoming marketing campaign',
    'Evaluated team performance and addressed concerns',
    'Outlined key deliverables for the next sprint',
  ];
  private mockActionItems = [
    'Update project roadmap',
    'Send budget approvals',
    'Schedule follow-up meeting',
    'Prepare marketing strategy deck',
    'Share performance reviews with the team',
    'Organize brainstorming session',
    'Prepare client presentation slides',
    'Finalize deliverable timelines',
    'Conduct team retrospective',
    'Draft sprint goals',
  ];

  constructor(private readonly meetingDocument: MeetingDocument) {}

  async perform(userId: string, id: string): Promise<void> {
    const meeting = await this.meetingDocument.get(id);

    if (!meeting) throw MeetingError.MEETING_NOT_FOUND;
    if (meeting.userId !== userId) throw MeetingError.FORBIDDEN_ACTION;

    const { summary, actionItems } = this.summarize(meeting);

    await this.meetingDocument.update(id, { summary, actionItems });
  }

  summarize(meeting: Meeting): MeetingSummary {
    this.logger.log(`Summarizing meeting=${meeting.title}`);

    const summary = this.generateSummary(meeting.transcript);
    const actionItems = this.generateActionItems(meeting.transcript);

    return { summary, actionItems };
  }

  private generateSummary(transcript: string): string {
    // *** THIS METHOD RECEIVES `meeting.transcript` AND WOULD GENERATE A SUMMARY USING AI ***

    const randomIndex = Math.floor(Math.random() * this.mockSummaries.length);
    const summary = this.mockSummaries[randomIndex];

    this.logger.log(
      `Generated summary=${summary} for this transcript=${transcript}`,
    );

    return summary;
  }

  private generateActionItems(transcript: string): string[] {
    // *** THIS METHOD RECEIVES `meeting.transcript` AND WOULD GENERATE ACTION ITEMS USING AI ***

    const shuffled = this.mockActionItems.sort(() => 0.5 - Math.random());
    const actionItems = shuffled.slice(0, 3);

    this.logger.log(
      `Generated actionItems=${JSON.stringify(actionItems)} for transcript=${transcript}`,
    );

    return actionItems;
  }
}
