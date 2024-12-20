import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConnectionOptions } from 'src/database';
import { MeetingSchema } from 'src/meeting/schema';
import { AuthMiddleware } from 'src/meeting/middleware';
import { MeetingController } from 'src/meeting/controller';

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
  controllers: [MeetingController],
})
export class MeetingModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
