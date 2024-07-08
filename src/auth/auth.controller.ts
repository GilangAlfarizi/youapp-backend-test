import { Body, Controller, Post, Put, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth.dto';
import { AuthService } from './auth.service';
import {
  BadRequest,
  Created,
  Success,
  errorResponse,
  sendResponse,
} from '../utils/response.util';

@ApiTags('Authentication')
@ApiBearerAuth('access-token')
@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'create user and empty profile' })
  @ApiBody({
    description: 'Request body',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        username: { type: 'string', example: 'username' },
        pasword: { type: 'string', example: 'passexample' },
        confirmPassword: { type: 'string', example: 'passexample' },
      },
    },
  })
  async registerUser(@Res() res: Response, @Body() body: RegisterUserDTO) {
    try {
      if (body.password != body.confirmPassword) {
        throw new BadRequest('Please confirm your password correctly');
      }
      const result = await this.authService.registerUser(body);

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
  @ApiOperation({ summary: 'login with email or username' })
  @ApiBody({
    description: 'Request body',
    required: true,
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'test@example.com' },
        username: { type: 'string', example: 'username' },
        pasword: { type: 'string', example: 'passexample' },
      },
    },
  })
  async loginUser(@Res() res: Response, @Body() body: LoginUserDTO) {
    try {
      const result = await this.authService.loginUser(body);

      await sendResponse(res, new Success('Successfully login', result));
    } catch (error) {
      console.error(error);
      errorResponse(error);
    }
  }
}
