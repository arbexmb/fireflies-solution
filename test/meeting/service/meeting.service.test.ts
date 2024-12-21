import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { MeetingService } from 'src/meeting/service';
import { Meeting } from 'src/meeting/schema';
import { BadRequestException } from '@nestjs/common';
import { MeetingDocument } from 'src/meeting/document';
import { CreateMeetingDto, UpdateMeetingDto } from 'src/meeting/dto';
import { MeetingError } from 'src/meeting/error';
import { TaskStatusEnum } from 'src/meeting/enum';

@suite
export class MeetingServiceTest {
  private meetingService: MeetingService;
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
  private meetingPayload = {
    title: 'test',
    date: new Date('2024-12-12 10:00'),
    participants: ['John Doe', 'Jane Doe'],
  } as CreateMeetingDto;
  private updatePayload = {
    transcript: 'new transcript',
  } as UpdateMeetingDto;

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingService,
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

    this.meetingService = module.get<MeetingService>(MeetingService);
    this.meetingDocument = module.get<MeetingDocument>(MeetingDocument);

    jest
      .spyOn(this.meetingDocument, 'getMany')
      .mockResolvedValue(this.meetings);
    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(this.meetings[0]);
  }

  @test
  async '[getMany] Should call document with correct data'() {
    await this.meetingService.getMany(this.userId);

    expect(this.meetingDocument.getMany).toHaveBeenCalledWith(this.userId);
  }

  @test
  async '[getMany] Should return meetings DTO objects'() {
    const result = await this.meetingService.getMany(this.userId);

    expect(result).toEqual(this.meetings);
  }

  @test
  async '[getMany] Should throw an error when no meeting is found'() {
    jest.spyOn(this.meetingDocument, 'getMany').mockResolvedValue([]);

    const service = this.meetingService.getMany(this.userId);

    await expect(service).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[getMany] Should throw an error when something went wrong'() {
    jest
      .spyOn(this.meetingDocument, 'getMany')
      .mockRejectedValue(new BadRequestException('Unexpected error'));

    const service = this.meetingService.getMany(this.userId);

    await expect(service).rejects.toThrow(
      new BadRequestException('Unexpected error'),
    );
  }

  @test
  async '[create] Should call document with correct data'() {
    await this.meetingService.create(this.userId, this.meetingPayload);

    expect(this.meetingDocument.create).toHaveBeenCalledWith({
      userId: this.userId,
      ...this.meetingPayload,
    });
  }

  @test
  async '[get] Should call document to find meeting'() {
    await this.meetingService.get('id');

    expect(this.meetingDocument.get).toHaveBeenCalledWith('id');
  }

  @test
  async '[get] Should throw an error when no meeting is found'() {
    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(null);

    const service = this.meetingService.get('id');

    await expect(service).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[get] Should return a meeting DTO object'() {
    const result = await this.meetingService.get('id');

    expect(result).toEqual(this.meetings[0]);
  }

  @test
  async '[update] Should call document to find meeting'() {
    await this.meetingService.update(this.userId, 'id', this.updatePayload);

    expect(this.meetingDocument.get).toHaveBeenCalledWith('id');
  }

  @test
  async '[update] Should throw an error if no meeting is found'() {
    jest.spyOn(this.meetingDocument, 'get').mockResolvedValue(null);

    const service = this.meetingService.update(
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

    const service = this.meetingService.update(
      this.userId,
      'id',
      this.updatePayload,
    );

    await expect(service).rejects.toThrow(MeetingError.FORBIDDEN_ACTION);
  }

  @test
  async '[update] Should call document method to update'() {
    await this.meetingService.update(this.userId, 'id', this.updatePayload);

    expect(this.meetingDocument.update).toHaveBeenCalledWith(
      'id',
      this.updatePayload,
    );
  }
}
