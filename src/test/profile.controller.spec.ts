import { Response } from 'express';
import { TestingModule, Test } from '@nestjs/testing';
import { MongooseConfigService } from '../db/db.config';
import * as mongoose from 'mongoose';
import { Success } from '../utils/response.util';
import { ProfileController } from '../controllers/profile.controller';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDTO } from '../dto/profile.dto';

describe('Profile Controller', () => {
  let controller: ProfileController;

  const mockJson = jest.fn();

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: mockJson,
    send: jest.fn(),
  } as unknown as Response;

  const mockService = {
    aggregateProfile: jest.fn(),
    updateOneProfile: jest.fn(),
  };

  beforeEach(async () => {
    mockJson.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        { provide: ProfileService, useValue: mockService },
        MongooseConfigService,
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  afterAll(async () => {
    for (const connection of mongoose.connections) {
      await connection.close();
    }
  });

  it('define', async () => {
    expect(controller).toBeDefined();
  });

  describe('getUserProfile', () => {
    it('getUserProfile - success', async () => {
      jest.spyOn(mockService, 'aggregateProfile').mockResolvedValue({});

      await controller.getUserProfile(mockRes, '66891e8f9b41fbec283199fc');

      expect(mockRes.json).toHaveBeenCalledWith(
        new Success('Successfully get user profile'),
      );
    });
    it('getUserProfile - error', async () => {
      const error = new Error('error');
      jest.spyOn(mockService, 'aggregateProfile').mockRejectedValue(error);

      await expect(
        controller.getUserProfile(mockRes, '66891e8f9b41fbec283199fc'),
      ).rejects.toThrow(expect.any(Error));
    });
  });

  describe('editUserProfile', () => {
    it('editUserProfile - success', async () => {
      jest.spyOn(mockService, 'updateOneProfile').mockResolvedValue({});

      await controller.editUserProfile(mockRes, {} as UpdateProfileDTO);

      expect(mockRes.json).toHaveBeenCalledWith(
        new Success('Successfully update user profile', {}),
      );
    });
    it('editUserProfile - error', async () => {
      const error = new Error('error');
      jest.spyOn(mockService, 'updateOneProfile').mockRejectedValue(error);

      await expect(
        controller.editUserProfile(mockRes, {} as UpdateProfileDTO),
      ).rejects.toThrow(expect.any(Error));
    });
  });
});
