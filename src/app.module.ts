import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeetingModule } from 'src/meeting/meeting.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MeetingModule,
    TaskModule,
  ],
})
export class AppModule {}
