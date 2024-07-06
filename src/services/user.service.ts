import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { MongooseConfigService } from '../db/db.config';
import { Model, FilterQuery } from 'mongoose';
import { Request } from 'express';
import { IUser } from 'src/schemas/interfaces/user.interface';
import { IProfile } from 'src/schemas/interfaces/profile.interface';
import UserSchema from 'src/schemas/user.schema';
import { LoginUser, RegisterUser } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { BadRequest, NotFound } from 'src/utils/response';
import { JwtService } from '@nestjs/jwt';

export class UserService {
  private userModel: Model<IUser>;
  private profileModel: Model<IProfile>;
  constructor(
    @Inject(MongooseConfigService)
    private connectionManager: MongooseConfigService,
    @Inject(REQUEST)
    private req: Request,
    private jwtService: JwtService,
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

  async registerUser(body: RegisterUser): Promise<void> {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    await this.userModel.create({
      username: body.username,
      password: hashedPassword,
      email: body.email,
    });
  }

  async loginUser(body: LoginUser): Promise<{ token: string }> {
    const user = await this.userModel.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });

    if (!user) {
      throw new NotFound('Sorry, wrong username or email');
    }
    const checkPassword = await bcrypt.compare(body.password, user.password);
    if (!checkPassword) {
      throw new BadRequest('Wrong password, please try again');
    }
    const payload = {
      sub: user._id,
      secret: process.env.JWT_KEY,
      username: user.username,
    };
    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
