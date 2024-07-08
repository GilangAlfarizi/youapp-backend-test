import { Inject } from '@nestjs/common';
import { MongooseConfigService } from '../db/db.config';
import { FilterQuery, Model, Types } from 'mongoose';
import UserSchema from '../schemas/user.schema';
import { IUser } from '../schemas/interfaces/user.interface';

export class UserService {
  private userModel: Model<IUser>;
  constructor(
    @Inject(MongooseConfigService)
    private connectionManager: MongooseConfigService,
  ) {
    this.setConnection();
  }

  public setConnection = async () => {
    this.userModel = (await this.connectionManager.getModel(
      `mongodb://127.0.0.1:27017/youapp_test`,
      'users',
      UserSchema,
    )) as Model<IUser>;
  };

  async getOneUser(filter: FilterQuery<IUser>): Promise<IUser> {
    return await this.userModel.findOne(filter);
  }

  async getUsers(filter: FilterQuery<IUser>): Promise<IUser[]> {
    return await this.userModel.find(filter);
  }
}
