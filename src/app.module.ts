import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MeetingModule } from 'src/meeting/meeting.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), MeetingModule],
})
export class AppModule {}
