import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { UpdateMeetingService } from 'src/meeting/service';
import { Meeting } from 'src/meeting/schema';
import { MeetingDocument } from 'src/meeting/document';
import { UpdateMeetingDto } from 'src/meeting/dto';
import { MeetingError } from 'src/meeting/error';
import { TaskStatusEnum } from 'src/task/enum';

@suite
export class UpdateMeetingServiceTest {
  private updateMeetingService: UpdateMeetingService;
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
  private updatePayload = {
    transcript: 'new transcript',
  } as UpdateMeetingDto;

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateMeetingService,
        {
          provide: MeetingDocument,
          useValue: {
            get: jest.fn(),
            getMany: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    this.updateMeetingService =
      module.get<UpdateMeetingService>(UpdateMeetingService);
    this.meetingDocument = module.get<MeetingDocument>(MeetingDocument);

    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(this.meetings[0]);
  }

  @test
  async '[update] Should call document to find meeting'() {
    await this.updateMeetingService.perform(
      this.userId,
      'id',
      this.updatePayload,
    );

    expect(this.meetingDocument.get).toHaveBeenCalledWith('id');
  }

  @test
  async '[update] Should throw an error if no meeting is found'() {
    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(null);

    const service = this.updateMeetingService.perform(
      this.userId,
      'id',
      this.updatePayload,
    );

    await expect(service).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[update] Should throw an error if user tries to update another user meeting'() {
    jest
      .spyOn(this.meetingDocument, 'get')
      .mockResolvedValue({ ...this.meetings[0], userId: 'another_user_id' });

    const service = this.updateMeetingService.perform(
      this.userId,
      'id',
      this.updatePayload,
    );

    await expect(service).rejects.toThrow(MeetingError.FORBIDDEN_ACTION);
  }

  @test
  async '[update] Should call document method to update'() {
    await this.updateMeetingService.perform(
      this.userId,
      'id',
      this.updatePayload,
    );

    expect(this.meetingDocument.update).toHaveBeenCalledWith(
      'id',
      this.updatePayload,
    );
  }
}
