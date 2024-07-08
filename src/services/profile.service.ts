import { Inject } from '@nestjs/common';
import { MongooseConfigService } from '../db/db.config';
import { FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { IProfile } from '../schemas/interfaces/profile.interface';
import ProfileSchema from '../schemas/profile.schema';
import { UpdateProfileDTO } from '../dto/profile.dto';
import { getHoroscope } from '../utils/birthday.util';

export class ProfileService {
  private profileModel: Model<IProfile>;
  constructor(
    @Inject(MongooseConfigService)
    private connectionManager: MongooseConfigService,
  ) {
    this.setConnection();
  }

  public setConnection = async () => {
    this.profileModel = (await this.connectionManager.getModel(
      `mongodb://127.0.0.1:27017/youapp_test`,
      'profiles',
      ProfileSchema,
    )) as Model<IProfile>;
  };

  async aggregateProfile(pipeline: PipelineStage[]): Promise<any[]> {
    return await this.profileModel.aggregate(pipeline);
  }

  async getOneProfile(filter: FilterQuery<IProfile>): Promise<IProfile> {
    return await this.profileModel.findOne(filter);
  }

  async updateOneProfile(body: UpdateProfileDTO): Promise<any> {
    const parseDate = new Date(body.birthday);
    const horoscope = getHoroscope(parseDate);

    return await this.profileModel.findOneAndUpdate(
      { user: body.user },
      {
        displayName: body.displayName,
        gender: body.gender,
        birthday: body.birthday,
        height: body.height,
        weight: body.weight,
        horoscope,
      },
      { new: true },
    );
  }
}
