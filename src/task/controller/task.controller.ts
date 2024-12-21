import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { AuthenticatedRequest } from 'src/middleware';
import { GetTasksService } from 'src/task/service';
import { TaskDto } from 'src/task/dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly getTasksService: GetTasksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
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
