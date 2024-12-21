import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { MeetingService } from 'src/meeting/service';
import { Meeting } from 'src/meeting/schema';
import { BadRequestException } from '@nestjs/common';
import { MeetingDocument } from 'src/meeting/document';
import { CreateMeetingDto } from 'src/meeting/dto';
import { MeetingError } from 'src/meeting/error';

@suite
export class MeetingServiceTest {
  private meetingService: MeetingService;
  private meetingDocument: MeetingDocument;
  private userId = '123';
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
      providers: [
        MeetingService,
        {
          provide: MeetingDocument,
          useValue: {
            getMany: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    this.meetingService = module.get<MeetingService>(MeetingService);
    this.meetingDocument = module.get<MeetingDocument>(MeetingDocument);

    jest
      .spyOn(this.meetingDocument, 'getMany')
      .mockResolvedValue(this.meetings);
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
  async '[getMany] Should throw an error when no meetinf is found'() {
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
}
