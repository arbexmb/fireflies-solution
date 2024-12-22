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
  MeetingStatsService,
  SummarizeMeetingService,
  UpdateMeetingService,
} from 'src/meeting/service';
import { AuthenticatedRequest } from 'src/middleware';
import {
  CreateMeetingDto,
  MeetingDto,
  MeetingStatsDto,
  UpdateMeetingTranscriptDto,
} from 'src/meeting/dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('meetings')
export class MeetingController {
  constructor(
    private readonly getMeetingService: GetMeetingService,
    private readonly createMeetingService: CreateMeetingService,
    private readonly updateMeetingService: UpdateMeetingService,
    private readonly summarizeMeetingService: SummarizeMeetingService,
    private readonly meetingStatsService: MeetingStatsService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve all meetings for the authenticated user' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the authenticated user',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of meetings retrieved successfully',
    type: [MeetingDto],
  })
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
  @ApiOperation({ summary: 'Create a new meeting' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the authenticated user',
    required: true,
  })
  @ApiBody({
    description: 'Data for creating a new meeting',
    type: CreateMeetingDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The newly created meeting',
    type: MeetingDto,
  })
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

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get meeting statistics' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the authenticated user',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting statistics retrieved successfully.',
    type: MeetingStatsDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error.',
  })
  async stats(): Promise<MeetingStatsDto> {
    try {
      return this.meetingStatsService.perform();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retrieve a specific meeting by ID' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the authenticated user',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'The unique identifier of the meeting',
    example: '676743999c801bcfe9529968',
  })
  @ApiResponse({
    status: 200,
    description: 'Details of the requested meeting',
    type: MeetingDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Meeting not found.',
    schema: {
      example: {
        statusCode: 404,
        error: 'Not Found',
        message: 'MEETING_NOT_FOUND',
      },
    },
  })
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
  @ApiOperation({ summary: 'Update the transcript of a specific meeting' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the authenticated user',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the meeting to update',
    required: true,
    example: '676743999c801bcfe9529968',
  })
  @ApiBody({
    description: 'Data to update the meeting transcript',
    type: UpdateMeetingTranscriptDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Transcript updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Meeting not found.',
    schema: {
      example: {
        statusCode: 404,
        error: 'Not Found',
        message: 'MEETING_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'User not authorized to update this meeting.',
    schema: {
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'FORBIDDEN_ACTION',
      },
    },
  })
  async updateTranscript(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: UpdateMeetingTranscriptDto,
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
  @ApiOperation({ summary: 'Summarize the meeting by its ID' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the authenticated user',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'The ID of the meeting to summarize',
    required: true,
    example: '676743999c801bcfe9529968',
  })
  @ApiResponse({
    status: 200,
    description: 'Meeting summarized successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Meeting not found.',
    schema: {
      example: {
        statusCode: 404,
        error: 'Not Found',
        message: 'MEETING_NOT_FOUND',
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'User not authorized to summarize this meeting.',
    schema: {
      example: {
        statusCode: 403,
        error: 'Forbidden',
        message: 'FORBIDDEN_ACTION',
      },
    },
  })
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
