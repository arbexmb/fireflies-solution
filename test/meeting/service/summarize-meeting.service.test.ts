import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { SummarizeMeetingService } from 'src/meeting/service';
import { Meeting } from 'src/meeting/schema';
import { MeetingDocument } from 'src/meeting/document';
import { UpdateMeetingDto } from 'src/meeting/dto';
import { MeetingError } from 'src/meeting/error';
import { TaskStatusEnum } from 'src/meeting/enum';

@suite
export class SummarizeMeetingServiceTest {
  private summarizeMeetingService: SummarizeMeetingService;
  private meetingDocument: MeetingDocument;
  private userId = '123';
  private meetings = [
    {
      userId: '123',
      title: 'test',
      date: new Date('2024-12-12'),
      participants: ['John Doe', 'Jane Doe'],
      transcript: 'transcript test',
      summary: 'summary test',
      actionItems: ['test1', 'test2'],
      tasks: [
        {
          _id: '6765e6ba309804b9352d6be9',
          meetingId: '6765e6ba309804b9352d6b83',
          userId: 'user5',
          title: 'Task 1 from Meeting 1',
          description: 'This is a sample task from meeting Meeting 1',
          status: TaskStatusEnum['in-progress'],
          dueDate: '2024-02-04T09:36:58.711Z',
        },
      ],
    } as Meeting,
  ];

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SummarizeMeetingService,
        {
          provide: MeetingDocument,
          useValue: {
            get: jest.fn(),
            getMany: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    this.summarizeMeetingService = module.get<SummarizeMeetingService>(
      SummarizeMeetingService,
    );
    this.meetingDocument = module.get<MeetingDocument>(MeetingDocument);

    jest
      .spyOn(this.meetingDocument, 'getMany')
      .mockResolvedValue(this.meetings);
    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(this.meetings[0]);
  }

  @test
  async '[summarize] Should call document to find meeting'() {
    await this.summarizeMeetingService.perform(this.userId, 'id');

    expect(this.meetingDocument.get).toHaveBeenCalledWith('id');
  }

  @test
  async '[summarize] Should throw an error if no meeting is found'() {
    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(null);

    const service = this.summarizeMeetingService.perform(this.userId, 'id');

    await expect(service).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[summarize] Should throw an error if user tries to update another user meeting'() {
    jest
      .spyOn(this.meetingDocument, 'get')
      .mockResolvedValue({ ...this.meetings[0], userId: 'another_user_id' });

    const service = this.summarizeMeetingService.perform(this.userId, 'id');

    await expect(service).rejects.toThrow(MeetingError.FORBIDDEN_ACTION);
  }

  // @test
  // async '[summarize] Should call service method to '() {
  //   await this.meetingService.update(this.userId, 'id', this.updatePayload);

  //   expect(this.meetingDocument.update).toHaveBeenCalledWith(
  //     'id',
  //     this.updatePayload,
  //   );
  // }
}
