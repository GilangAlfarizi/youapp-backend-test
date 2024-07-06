import { Body, Controller, Post, Put, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginUser, RegisterUser } from 'src/dto/user.dto';
import { UserService } from 'src/services/user.service';
import {
  BadRequest,
  Created,
  Success,
  errorResponse,
  sendResponse,
} from 'src/utils/response';

@ApiTags('User')
@ApiBearerAuth('access-token')
@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register') //baru dummy
  async registerUser(@Res() res: Response, @Body() body: RegisterUser) {
    try {
      if (body.password != body.confirmPassword) {
        throw new BadRequest('Please confirm your password correctly');
      }
      const result = await this.userService.registerUser(body);

      await sendResponse(
        res,
        new Created('Successfully Register User', result),
      );
    } catch (error) {
      console.error(error);
      errorResponse(error);
    }
  }

  @Post('/login')
  async loginUser(@Res() res: Response, @Body() body: LoginUser) {
    try {
      const result = await this.userService.loginUser(body);

      await sendResponse(res, new Success('Successfully login', result));
    } catch (error) {
      console.error(error);
      errorResponse(error);
    }
  }
}
