import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';

@Controller()
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post('success')
  async makeSuccess(@Req() req: Request, @Res() res: Response) {
    try {
      await this.service.test(req.body, false);
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }

  @Post('fail')
  async makeFail(@Req() req: Request, @Res() res: Response) {
    try {
      await this.service.test(req.body, true);
      res.status(200).send();
    } catch (error) {
      res.status(400).send(error);
    }
  }

  @Post('non-transaction')
  async makeSuccess2(@Req() req: Request, @Res() res: Response) {
    try {
      await this.service.test2(req.body, true);
      res.status(200).send();
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  }
}
