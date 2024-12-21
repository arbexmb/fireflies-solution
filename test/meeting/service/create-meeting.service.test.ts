import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { CreateMeetingService } from 'src/meeting/service';
import { MeetingDocument } from 'src/meeting/document';
import { CreateMeetingDto } from 'src/meeting/dto';

@suite
export class CreateMeetingServiceTest {
  private createMeetingService: CreateMeetingService;
  private meetingDocument: MeetingDocument;
  private userId = '123';
  private meetingPayload = {
    title: 'test',
    date: new Date('2024-12-12 10:00'),
    participants: ['John Doe', 'Jane Doe'],
  } as CreateMeetingDto;

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateMeetingService,
        {
          provide: MeetingDocument,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    this.createMeetingService =
      module.get<CreateMeetingService>(CreateMeetingService);
    this.meetingDocument = module.get<MeetingDocument>(MeetingDocument);
  }

  @test
  async '[create] Should call document with correct data'() {
    await this.createMeetingService.perform(this.userId, this.meetingPayload);

    expect(this.meetingDocument.create).toHaveBeenCalledWith({
      userId: this.userId,
      ...this.meetingPayload,
    });
  }
}
