import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { TaskDocument } from 'src/task/document';
import { CreateTasksService } from 'src/task/service';

@suite
export class CreateTasksServiceTest {
  private createTasksService: CreateTasksService;
  private taskDocument: TaskDocument;
  private userId = '123';
  private meetingId = 'abc';
  private titles = ['one', 'two'];

  async before() {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTasksService,
        {
          provide: TaskDocument,
          useValue: {
            deleteTasks: jest.fn(),
            createMany: jest.fn(),
          },
        },
      ],
    }).compile();

    this.createTasksService =
      module.get<CreateTasksService>(CreateTasksService);
    this.taskDocument = module.get<TaskDocument>(TaskDocument);
  }

  @test
  async '[perform] Should call method to delete tasks'() {
    await this.createTasksService.perform(
      this.userId,
      this.meetingId,
      this.titles,
    );

    expect(this.taskDocument.deleteTasks).toHaveBeenCalledWith(this.meetingId);
  }

  @test
  async '[perform] Should call method to create tasks'() {
    await this.createTasksService.perform(
      this.userId,
      this.meetingId,
      this.titles,
    );

    const tasks = this.titles.map((title) => ({
      userId: this.userId,
      meetingId: this.meetingId,
      title,
    }));

    expect(this.taskDocument.createMany).toHaveBeenCalledWith(tasks);
  }
}
