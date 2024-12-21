import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { MeetingService } from 'src/meeting/service';
import { AuthenticatedRequest } from 'src/meeting/middleware';
import { CreateMeetingDto, MeetingDto } from 'src/meeting/dto';

@Controller('meetings')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMany(@Req() req: AuthenticatedRequest): Promise<MeetingDto[]> {
    try {
      const { userId } = req;
      const meetings = await this.meetingService.getMany(userId);

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
      const meeting = await this.meetingService.create(userId, body);

      return new MeetingDto(meeting);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async get(@Param('id') id: string): Promise<MeetingDto> {
    try {
      const meeting = await this.meetingService.get(id);

      return new MeetingDto(meeting);
    } catch (error) {
      throw error;
    }
  }
}
