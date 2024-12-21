import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class MeetingError {
  static MEETING_NOT_FOUND: Error = new NotFoundException('MEETING_NOT_FOUND');
  static FORBIDDEN_ACTION: Error = new ForbiddenException('FORBIDDEN_ACTION');
}
