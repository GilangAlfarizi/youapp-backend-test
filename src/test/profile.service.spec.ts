import { Test, TestingModule } from '@nestjs/testing';
import { MongooseConfigService } from '../db/db.config';
import { ProfileService } from '../services/profile.service';
import { UpdateProfileDTO } from '../dto/profile.dto';

describe('ProfileService', () => {
  let service: ProfileService;

  const mockModel = {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: MongooseConfigService,
          useValue: {
            getModel: jest.fn().mockResolvedValue(mockModel),
          },
        },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('aggregateProfile', async () => {
    jest.spyOn(mockModel, 'aggregate').mockResolvedValue(null);

    await service.aggregateProfile([]);

    expect(mockModel.aggregate).toHaveBeenCalled();
  });

  it('getOneProfile', async () => {
    jest.spyOn(mockModel, 'findOne').mockResolvedValue({});

    await service.getOneProfile({});

    expect(mockModel.findOne).toHaveBeenCalled();
  });

  it('updateOneProfile', async () => {
    const mockBody = {
      user: '66891e8f9b41fbec283199fc',
      displayName: 'mockDisplayName',
      gender: 'Male',
      birthday: '2002-16-11',
      height: 12,
      weight: 123,
    } as UpdateProfileDTO;
    jest.spyOn(mockModel, 'findOneAndUpdate').mockResolvedValue({});

    await service.updateOneProfile(mockBody);

    expect(mockModel.findOneAndUpdate).toHaveBeenCalled();
  });
});
