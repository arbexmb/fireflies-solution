import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { AuthenticatedRequest } from 'src/middleware';
import { TaskStatusEnum } from 'src/task/enum';
import { GetTasksService } from 'src/task/service';
import { TaskController } from 'src/task/controller';
import { Task } from 'src/task/schema';
import { TaskDocument } from 'src/task/document';

@suite
export class TaskControllerTest {
  private taskController: TaskController;
  private getTasksService: GetTasksService;
  private req: AuthenticatedRequest = {
    userId: 'user123',
  } as AuthenticatedRequest;
  private tasks = [
    {
      meetingId: '6765e6ba309804b9352d6b83',
      userId: 'user5',
      title: 'Task 1 from Meeting 1',
      description: 'This is a sample task from meeting Meeting 1',
      status: TaskStatusEnum['in-progress'],
      dueDate: new Date('2024-02-04T09:36:58.711Z'),
    } as Task,
  ];

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        GetTasksService,
        {
          provide: TaskDocument,
          useValue: {
            getByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    this.taskController = module.get<TaskController>(TaskController);
    this.getTasksService = module.get<GetTasksService>(GetTasksService);

    jest.spyOn(this.getTasksService, 'perform').mockResolvedValue(this.tasks);
  }

  @test
  async '[getByUser] Should call service with correct data'() {
    await this.taskController.getByUser(this.req);

    expect(this.getTasksService.perform).toHaveBeenCalledWith(this.req.userId);
  }

  @test
  async '[getByUser] Should throw an error if something went wrong'() {
    jest
      .spyOn(this.getTasksService, 'perform')
      .mockRejectedValue(new Error('Unexpected error'));

    const method = this.taskController.getByUser(this.req);

    await expect(method).rejects.toThrow(new Error('Unexpected error'));
  }
}
