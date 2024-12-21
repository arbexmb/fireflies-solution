import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
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

@Controller('meetings')
export class MeetingController {
  constructor(
    private readonly getMeetingService: GetMeetingService,
    private readonly createMeetingService: CreateMeetingService,
    private readonly updateMeetingService: UpdateMeetingService,
    private readonly summarizeMeetingService: SummarizeMeetingService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMany(@Req() req: AuthenticatedRequest): Promise<MeetingDto[]> {
    try {
      const { userId } = req;
      const meetings = await this.getMeetingService.getMany(userId);

      return meetings.map((meeting) => new MeetingDto(meeting));
    } catch (error) {
      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() body: CreateMeetingDto,
  ): Promise<MeetingDto> {
    try {
      const { userId } = req;
      const meeting = await this.createMeetingService.perform(userId, body);

      return new MeetingDto(meeting);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string): Promise<MeetingDto> {
    try {
      const meeting = await this.getMeetingService.get(id);

      return new MeetingDto(meeting);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':id/transcript')
  @HttpCode(HttpStatus.OK)
  async updateTranscript(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateMeetingDto,
  ): Promise<void> {
    try {
      const { userId } = req;
      await this.updateMeetingService.perform(userId, id, body);
    } catch (error) {
      throw error;
    }
  }

  @Post(':id/summarize')
  @HttpCode(HttpStatus.OK)
  async summarize(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      const { userId } = req;
      await this.summarizeMeetingService.perform(userId, id);
    } catch (error) {
      throw error;
    }
  }
}
