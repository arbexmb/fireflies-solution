import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionOptions } from 'src/database';
import { MeetingSchema } from 'src/meeting/schema';
import { AuthMiddleware } from 'src/meeting/middleware';
import { MeetingController } from 'src/meeting/controller';
import { MeetingService } from 'src/meeting/service';
import { MeetingDocument } from 'src/meeting/document';

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
  ],
  providers: [MeetingService, MeetingDocument],
  controllers: [MeetingController],
})
export class MeetingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
