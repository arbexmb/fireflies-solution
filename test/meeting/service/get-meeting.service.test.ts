import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { GetMeetingService } from 'src/meeting/service';
import { Meeting } from 'src/meeting/schema';
import { BadRequestException } from '@nestjs/common';
import { MeetingDocument } from 'src/meeting/document';
import { MeetingError } from 'src/meeting/error';
import { TaskStatusEnum } from 'src/task/enum';

@suite
export class GetMeetingServiceTest {
  private getMeetingService: GetMeetingService;
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
        GetMeetingService,
        {
          provide: MeetingDocument,
          useValue: {
            get: jest.fn(),
            getMany: jest.fn(),
          },
        },
      ],
    }).compile();

    this.getMeetingService = module.get<GetMeetingService>(GetMeetingService);
    this.meetingDocument = module.get<MeetingDocument>(MeetingDocument);

    jest
      .spyOn(this.meetingDocument, 'getMany')
      .mockResolvedValue(this.meetings);
    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(this.meetings[0]);
  }

  @test
  async '[getMany] Should call document with correct data'() {
    await this.getMeetingService.getMany(this.userId);

    expect(this.meetingDocument.getMany).toHaveBeenCalledWith(this.userId);
  }

  @test
  async '[getMany] Should return meetings DTO objects'() {
    const result = await this.getMeetingService.getMany(this.userId);

    expect(result).toEqual(this.meetings);
  }

  @test
  async '[getMany] Should throw an error when no meeting is found'() {
    jest.spyOn(this.meetingDocument, 'getMany').mockResolvedValue([]);

    const service = this.getMeetingService.getMany(this.userId);

    await expect(service).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[getMany] Should throw an error when something went wrong'() {
    jest
      .spyOn(this.meetingDocument, 'getMany')
      .mockRejectedValue(new BadRequestException('Unexpected error'));

    const service = this.getMeetingService.getMany(this.userId);

    await expect(service).rejects.toThrow(
      new BadRequestException('Unexpected error'),
    );
  }

  @test
  async '[get] Should call document to find meeting'() {
    await this.getMeetingService.get('id');

    expect(this.meetingDocument.get).toHaveBeenCalledWith('id');
  }

  @test
  async '[get] Should throw an error when no meeting is found'() {
    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(null);

    const service = this.getMeetingService.get('id');

    await expect(service).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[get] Should return a meeting DTO object'() {
    const result = await this.getMeetingService.get('id');

    expect(result).toEqual(this.meetings[0]);
  }
}
