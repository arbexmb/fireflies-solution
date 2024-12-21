import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { MeetingController } from 'src/meeting/controller';
import { MeetingService } from 'src/meeting/service';
import { AuthenticatedRequest } from 'src/meeting/middleware';
import { CreateMeetingDto, MeetingDto } from 'src/meeting/dto';
import { Meeting } from 'src/meeting/schema';
import { BadRequestException } from '@nestjs/common';
import { MeetingDocument } from 'src/meeting/document';
import { MeetingError } from 'src/meeting/error';

@suite
export class MeetingControllerTest {
  private meetingController: MeetingController;
  private meetingService: MeetingService;
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
    } as Meeting,
  ];
  private meetingPayload = {
    title: 'test',
    date: new Date('2024-12-12 10:00'),
    participants: ['John Doe', 'Jane Doe'],
  } as CreateMeetingDto;

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
      providers: [
        MeetingService,
        {
          provide: MeetingDocument,
          useValue: {
            getMany: jest.fn(),
          },
        },
      ],
    }).compile();

    this.meetingController = module.get<MeetingController>(MeetingController);
    this.meetingService = module.get<MeetingService>(MeetingService);

    jest.spyOn(this.meetingService, 'getMany').mockResolvedValue(this.meetings);
    jest
      .spyOn(this.meetingService, 'create')
      .mockResolvedValue(this.meetings[0]);
    jest.spyOn(this.meetingService, 'get').mockResolvedValue(this.meetings[0]);
  }

  @test
  async '[getMany] Should call service with correct data'() {
    await this.meetingController.getMany(this.req);

    expect(this.meetingService.getMany).toHaveBeenCalledWith('user123');
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
      .spyOn(this.meetingService, 'getMany')
      .mockRejectedValue(MeetingError.MEETING_NOT_FOUND);

    const method = this.meetingController.getMany(this.req);

    await expect(method).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }

  @test
  async '[create] Should call service with correct data'() {
    await this.meetingController.create(this.req, this.meetingPayload);

    expect(this.meetingService.create).toHaveBeenCalledWith(
      'user123',
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
      .spyOn(this.meetingService, 'create')
      .mockRejectedValue(new BadRequestException('Unexpected error'));

    const method = this.meetingController.create(this.req, this.meetingPayload);

    await expect(method).rejects.toThrow(
      new BadRequestException('Unexpected error'),
    );
  }

  @test
  async '[get] Should call service with correct data'() {
    await this.meetingController.get('id');

    expect(this.meetingService.get).toHaveBeenCalledWith('id');
  }

  @test
  async '[get] Should return a meeting'() {
    const result = await this.meetingController.get('id');

    expect(result).toEqual(new MeetingDto(this.meetings[0]));
  }

  @test
  async '[get] Should throw an error when no meeting is found'() {
    jest
      .spyOn(this.meetingService, 'get')
      .mockRejectedValue(MeetingError.MEETING_NOT_FOUND);

    const method = this.meetingController.get('id');

    await expect(method).rejects.toThrow(MeetingError.MEETING_NOT_FOUND);
  }
}
