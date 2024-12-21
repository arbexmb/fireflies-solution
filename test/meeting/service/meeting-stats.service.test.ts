import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { MeetingStatsService } from 'src/meeting/service';
import { MeetingDocument } from 'src/meeting/document';

@suite
export class MeetingStatsServiceTest {
  private meetingStatsService: MeetingStatsService;
  private meetingDocument: MeetingDocument;

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingStatsService,
        {
          provide: MeetingDocument,
          useValue: {
            getGeneralStats: jest.fn(),
            getTopParticipants: jest.fn(),
            getMeetingsByDayOfWeek: jest.fn(),
          },
        },
      ],
    }).compile();

    this.meetingStatsService =
      module.get<MeetingStatsService>(MeetingStatsService);
    this.meetingDocument = module.get<MeetingDocument>(MeetingDocument);
  }

  @test
  async '[create] Should call document methods to get stats'() {
    await this.meetingStatsService.perform();

    expect(this.meetingDocument.getGeneralStats).toHaveBeenCalled();
    expect(this.meetingDocument.getTopParticipants).toHaveBeenCalled();
    expect(this.meetingDocument.getMeetingsByDayOfWeek).toHaveBeenCalled();
  }
}
