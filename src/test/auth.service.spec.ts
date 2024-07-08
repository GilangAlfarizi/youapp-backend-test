import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth/auth.service';
import { MongooseConfigService } from '../db/db.config';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    countDocuments: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: MongooseConfigService,
          useValue: {
            getModel: jest.fn().mockResolvedValue(mockModel),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Auth Register User', () => {
    const mockBody = {
      email: 'test@gmail.com',
      username: 'testusername',
      password: 'admin123',
      confirmPassword: 'admin123',
    };
    it('registerUser - success', async () => {
      jest.spyOn(mockModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(mockModel, 'create').mockResolvedValue({});

      await service.registerUser(mockBody);

      expect(mockModel.create).toHaveBeenCalled();
    });
  });
});
