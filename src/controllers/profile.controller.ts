import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UpdateProfileDTO } from '../dto/profile.dto';
import { getUserProfileDetailPipeline } from '../pipelines/userProfileDetail.pipeline';
import { ProfileService } from '../services/profile.service';
import { Success, errorResponse, sendResponse } from '../utils/response.util';

@ApiTags('Profile')
@ApiBearerAuth('access-token')
@Controller('/profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/:userId')
  @ApiResponse({
    status: 200,
    description: 'Successfully get user profile',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 200 },
        message: {
          type: 'string',
          example: 'Successfully get user profile',
        },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6628774a5808f59288ccb58e' },
            displayName: { type: 'string', example: 'John Doe' },
            gender: { type: 'string', example: 'Male' },
            birthday: { type: 'string', example: '16-11-2002' },
            horoscope: { type: 'string', example: 'Scorpio' },
            zodiac: { type: 'string', example: 'Horse' },
            height: { type: 'number', example: 169 },
            weight: { type: 'number', example: 56 },
            username: { type: 'string', example: 'exampleusername' },
          },
        },
      },
    },
  })
  async getUserProfile(@Res() res: Response, @Param('userId') user: string) {
    try {
      let result;
      const profile = await this.profileService.aggregateProfile(
        getUserProfileDetailPipeline(user),
      );

      result = profile[0];
      await sendResponse(
        res,
        new Success('Successfully get user profile', result),
      );
    } catch (error) {
      console.error(error);
      errorResponse(error);
    }
  }

  @Put('/')
  @ApiBody({
    description: 'Request body',
    required: true,
    schema: {
      type: 'object',
      properties: {
        user: { type: 'string', example: 'userId' },
        displayName: { type: 'string', example: 'John Doe' },
        gender: { type: 'string', example: 'Male' },
        birthday: { type: 'string', example: '2002-11-21' },
        height: { type: 'number', example: 168 },
        weight: { type: 'number', example: 55 },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully update user profile',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'integer', example: 200 },
        message: {
          type: 'string',
          example: 'Successfully update user profile',
        },
        data: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '6628774a5808f59288ccb58e' },
            displayName: { type: 'string', example: 'John Doe' },
            gender: { type: 'string', example: 'Male' },
            birthday: { type: 'string', example: '16-11-2002' },
            horoscope: { type: 'string', example: 'Scorpio' },
            zodiac: { type: 'string', example: 'Horse' },
            height: { type: 'number', example: 169 },
            weight: { type: 'number', example: 56 },
          },
        },
      },
    },
  })
  async editUserProfile(@Res() res: Response, @Body() body: UpdateProfileDTO) {
    try {
      const result = await this.profileService.updateOneProfile(body);

      await sendResponse(
        res,
        new Success('Successfully update user profile', result),
      );
    } catch (error) {
      console.error(error);
      errorResponse(error);
    }
  }
}
