import { Response } from 'express';
import { TestingModule, Test } from '@nestjs/testing';
import { MongooseConfigService } from '../db/db.config';
import * as mongoose from 'mongoose';
import { Created } from '../utils/response.util';
import { AuthController } from '../auth/auth.controller';
import { RegisterUserDTO } from '../dto/auth.dto';
import { AuthService } from '../auth/auth.service';

describe('Auth Controller', () => {
  let controller: AuthController;

  const mockJson = jest.fn();

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: mockJson,
    send: jest.fn(),
  } as unknown as Response;

  const mockService = {
    registerUser: jest.fn(),
    loginUser: jest.fn(),
  };

  beforeEach(async () => {
    mockJson.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockService },
        MongooseConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterAll(async () => {
    for (const connection of mongoose.connections) {
      await connection.close();
    }
  });

  it('define', async () => {
    expect(controller).toBeDefined();
  });

  describe('POST register user', () => {
    it('registerUser - success', async () => {
      jest.spyOn(mockService, 'registerUser').mockResolvedValue({});

      await controller.registerUser(mockRes, {} as RegisterUserDTO);

      expect(mockRes.json).toHaveBeenCalledWith(
        new Created('Successfully Register User', {}),
      );
    });
    it('registerUser - error', async () => {
      const error = new Error('error');
      jest.spyOn(mockService, 'registerUser').mockRejectedValue(error);

      await expect(
        controller.registerUser(mockRes, {} as RegisterUserDTO),
      ).rejects.toThrow(expect.any(Error));
    });
  });
});
