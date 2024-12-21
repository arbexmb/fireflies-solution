import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionOptions } from 'src/database';
import { AuthMiddleware } from 'src/middleware';
import { TaskSchema } from 'src/task/schema';
import { CreateTasksService } from 'src/task/service';
import { TaskDocument } from 'src/task/document';

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
  providers: [CreateTasksService, TaskDocument],
  controllers: [],
  exports: [CreateTasksService],
})
export class TaskModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
