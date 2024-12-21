import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionOptions } from 'src/database';
import { MeetingSchema } from 'src/meeting/schema';
import { AuthMiddleware } from 'src/middleware';
import { MeetingController } from 'src/meeting/controller';
import {
  CreateMeetingService,
  GetMeetingService,
  SummarizeMeetingService,
  UpdateMeetingService,
} from 'src/meeting/service';
import { MeetingDocument } from 'src/meeting/document';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongooseConnectionOptions,
    }),
    MongooseModule.forFeature([
      {
        name: 'meetings',
        schema: MeetingSchema,
      },
    ]),
    TaskModule,
  ],
  providers: [
    GetMeetingService,
    CreateMeetingService,
    UpdateMeetingService,
    MeetingDocument,
    SummarizeMeetingService,
  ],
  controllers: [MeetingController],
})
export class MeetingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
