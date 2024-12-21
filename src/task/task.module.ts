import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionOptions } from 'src/database';
import { AuthMiddleware } from 'src/middleware';
import { TaskSchema } from 'src/task/schema';
import { CreateTasksService, GetTasksService } from 'src/task/service';
import { TaskDocument } from 'src/task/document';
import { TaskController } from 'src/task/controller';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConnectionOptions,
    }),
    MongooseModule.forFeature([
      {
        name: 'tasks',
        schema: TaskSchema,
      },
    ]),
  ],
  providers: [CreateTasksService, GetTasksService, TaskDocument],
  controllers: [TaskController],
  exports: [CreateTasksService],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
