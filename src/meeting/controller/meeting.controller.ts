import { Controller, Get, HttpCode, HttpStatus, Req } from '@nestjs/common';

@Controller('meetings')
export class MeetingController {
  @Get()
  @HttpCode(HttpStatus.OK)
  getMany(@Req() req: Request): void {
    console.log(req);
  }
}
