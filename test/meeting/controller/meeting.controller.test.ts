import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { MeetingController } from 'src/meeting/controller';
import {
  CreateMeetingService,
  GetMeetingService,
  SummarizeMeetingService,
  UpdateMeetingService,
} from 'src/meeting/service';
import { AuthenticatedRequest } from 'src/middleware';
import {
  CreateMeetingDto,
  MeetingDto,
  UpdateMeetingDto,
} from 'src/meeting/dto';
import { Meeting } from 'src/meeting/schema';
import { BadRequestException } from '@nestjs/common';
import { MeetingDocument } from 'src/meeting/document';
import { MeetingError } from 'src/meeting/error';
import { TaskStatusEnum } from 'src/task/enum';
import { CreateTasksService } from 'src/task/service';

@suite
export class MeetingControllerTest {
  private meetingController: MeetingController;
  private getMeetingService: GetMeetingService;
  private createMeetingService: CreateMeetingService;
  private updateMeetingService: UpdateMeetingService;
  private summarizeMeetingService: SummarizeMeetingService;
  private req: AuthenticatedRequest = {
    userId: 'user123',
  } as AuthenticatedRequest;
  private meetings = [
    {
      userId: '1',
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
      controllers: [MeetingController],
      providers: [
        GetMeetingService,
        CreateMeetingService,
        UpdateMeetingService,
        SummarizeMeetingService,
        {
          provide: CreateTasksService,
          useValue: {
            perform: jest.fn(),
          },
        },
        {
          provide: MeetingDocument,
          useValue: {
            getMany: jest.fn(),
          },
        },
      ],
    }).compile();

    this.meetingController = module.get<MeetingController>(MeetingController);
    this.getMeetingService = module.get<GetMeetingService>(GetMeetingService);
    this.createMeetingService =
      module.get<CreateMeetingService>(CreateMeetingService);
    this.updateMeetingService =
      module.get<UpdateMeetingService>(UpdateMeetingService);
    this.summarizeMeetingService = module.get<SummarizeMeetingService>(
      SummarizeMeetingService,
    );

    jest
      .spyOn(this.getMeetingService, 'getMany')
      .mockResolvedValue(this.meetings);
    jest
      .spyOn(this.createMeetingService, 'perform')
      .mockResolvedValue(this.meetings[0]);
    jest
      .spyOn(this.getMeetingService, 'get')
      .mockResolvedValue(this.meetings[0]);
    jest.spyOn(this.updateMeetingService, 'perform').mockResolvedValue();
    jest.spyOn(this.summarizeMeetingService, 'perform').mockResolvedValue();
  }

  @test
  async '[getMany] Should call service with correct data'() {
    await this.meetingController.getMany(this.req);

    expect(this.getMeetingService.getMany).toHaveBeenCalledWith(
      this.req.userId,
    );
  }

  @test
  async '[getMany] Should return meetings DTO objects'() {
    const result = await this.meetingController.getMany(this.req);

    expect(result).toEqual(
      this.meetings.map((meeting) => new MeetingDto(meeting)),
    );
  }

  @test
  async '[getMany] Should throw an error when no meeting is found'() {
    jest
      .spyOn(this.getMeetingService, 'getMany')
      .mockRejectedValue(MeetingError.MEETING_NOT_FOUND);

    const method = this.meetingController.getMany(this.req);

    await expect(method).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[create] Should call service with correct data'() {
    await this.meetingController.create(this.req, this.meetingPayload);

    expect(this.createMeetingService.perform).toHaveBeenCalledWith(
      this.req.userId,
      this.meetingPayload,
    );
  }

  @test
  async '[create] Should return created meeting'() {
    const result = await this.meetingController.create(
      this.req,
      this.meetingPayload,
    );

    expect(result).toEqual(new MeetingDto(this.meetings[0]));
  }

  @test
  async '[create] Should throw an error when something went wrong'() {
    jest
      .spyOn(this.createMeetingService, 'perform')
      .mockRejectedValue(new BadRequestException('Unexpected error'));

    const method = this.meetingController.create(this.req, this.meetingPayload);

    await expect(method).rejects.toThrow(
      new BadRequestException('Unexpected error'),
    );
  }

  @test
  async '[get] Should call service with correct data'() {
    await this.meetingController.get('id');

    expect(this.getMeetingService.get).toHaveBeenCalledWith('id');
  }

  @test
  async '[get] Should return a meeting'() {
    const result = await this.meetingController.get('id');

    expect(result).toEqual(new MeetingDto(this.meetings[0]));
  }

  @test
  async '[get] Should throw an error when no meeting is found'() {
    jest
      .spyOn(this.getMeetingService, 'get')
      .mockRejectedValue(MeetingError.MEETING_NOT_FOUND);

    const method = this.meetingController.get('id');

    await expect(method).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[updateTranscript] Should call service with correct data'() {
    await this.meetingController.updateTranscript(
      this.req,
      'id',
      this.updatePayload,
    );

    expect(this.updateMeetingService.perform).toHaveBeenCalledWith(
      this.req.userId,
      'id',
      this.updatePayload,
    );
  }

  @test
  async '[updateTranscript] Should throw an error when no meeting is found'() {
    jest
      .spyOn(this.updateMeetingService, 'perform')
      .mockRejectedValue(MeetingError.MEETING_NOT_FOUND);

    const method = this.meetingController.updateTranscript(
      this.req,
      'id',
      this.updatePayload,
    );

    await expect(method).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[updateTranscript] Should throw an error when user tries to update other user meeting'() {
    jest
      .spyOn(this.updateMeetingService, 'perform')
      .mockRejectedValue(MeetingError.FORBIDDEN_ACTION);

    const method = this.meetingController.updateTranscript(
      this.req,
      'id',
      this.updatePayload,
    );

    await expect(method).rejects.toThrow(MeetingError.FORBIDDEN_ACTION);
  }

  @test
  async '[summarize] Should call service with correct data'() {
    await this.meetingController.summarize(this.req, 'id');

    expect(this.summarizeMeetingService.perform).toHaveBeenCalledWith(
      this.req.userId,
      'id',
    );
  }

  @test
  async '[summarize] Should throw an error when no meeting is found'() {
    jest
      .spyOn(this.summarizeMeetingService, 'perform')
      .mockRejectedValue(MeetingError.MEETING_NOT_FOUND);

    const method = this.meetingController.summarize(this.req, 'id');

    await expect(method).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[summarize] Should throw an error when user tries to update other user meeting'() {
    jest
      .spyOn(this.summarizeMeetingService, 'perform')
      .mockRejectedValue(MeetingError.FORBIDDEN_ACTION);

    const method = this.meetingController.summarize(this.req, 'id');

    await expect(method).rejects.toThrow(MeetingError.FORBIDDEN_ACTION);
  }
}
