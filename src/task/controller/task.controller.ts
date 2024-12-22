import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/middleware';
import { GetTasksService } from 'src/task/service';
import { TaskDto } from 'src/task/dto';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('tasks')
export class TaskController {
  constructor(private readonly getTasksService: GetTasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all tasks for the authenticated user' })
  @ApiHeader({
    name: 'x-user-id',
    description: 'The ID of the authenticated user',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'List of tasks associated with the authenticated user',
    type: [TaskDto],
  })
  async getByUser(@Req() req: AuthenticatedRequest): Promise<TaskDto[]> {
    try {
      const { userId } = req;
      const tasks = await this.getTasksService.perform(userId);

      return tasks.map((task) => new TaskDto(task));
    } catch (error) {
      throw error;
    }
  }
}
