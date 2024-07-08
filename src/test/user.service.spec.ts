import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConfigService } from '../db/db.config';
import { UserService } from '../services/user.service';

describe('UserService', () => {
  let service: UserService;

  const mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: MongooseConfigService,
          useValue: {
            getModel: jest.fn().mockResolvedValue(mockModel),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getOneUser', async () => {
    jest.spyOn(mockModel, 'findOne').mockResolvedValue({});

    await service.getOneUser({});

    expect(mockModel.findOne).toHaveBeenCalled();
  });

  it('getUsers', async () => {
    jest.spyOn(mockModel, 'find').mockResolvedValue({});

    await service.getUsers({});

    expect(mockModel.find).toHaveBeenCalled();
  });
});
