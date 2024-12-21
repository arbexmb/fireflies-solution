import { Test, TestingModule } from '@nestjs/testing';
import { suite, test } from '@testdeck/jest';
import { TaskDocument } from 'src/task/document';
import { GetTasksService } from 'src/task/service';

@suite
export class GetTasksServiceTest {
  private getTasksService: GetTasksService;
  private taskDocument: TaskDocument;
  private userId = '123';

  async before() {
    const module: TestingModule = await Test.createTestingModule({
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

    this.getTasksService = module.get<GetTasksService>(GetTasksService);
    this.taskDocument = module.get<TaskDocument>(TaskDocument);
  }

  @test
  async '[perform] Should call method to get tasks by user'() {
    await this.getTasksService.perform(this.userId);

    expect(this.taskDocument.getByUser).toHaveBeenCalledWith(this.userId);
  }
}
