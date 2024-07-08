import { Inject, Injectable } from '@nestjs/common';
import { MongooseConfigService } from '../db/db.config';
import { Model, ObjectId } from 'mongoose';
import { IUser } from '../schemas/interfaces/user.interface';
import { IProfile } from '../schemas/interfaces/profile.interface';
import UserSchema from '../schemas/user.schema';
import { LoginUserDTO, RegisterUserDTO } from '../dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { BadRequest, NotFound } from '../utils/response.util';
import { JwtService } from '@nestjs/jwt';
import ProfileSchema from '../schemas/profile.schema';

@Injectable()
export class AuthService {
  private userModel: Model<IUser>;
  private profileModel: Model<IProfile>;
  constructor(
    @Inject(MongooseConfigService)
    private connectionManager: MongooseConfigService,
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
    this.profileModel = (await this.connectionManager.getModel(
      `mongodb://127.0.0.1:27017/youapp_test`,
      'profiles',
      ProfileSchema,
    )) as Model<IProfile>;
  };

  async registerUser(body: RegisterUserDTO): Promise<void> {
    const findUser = await this.userModel.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });
    if (findUser) {
      throw new BadRequest('Sorry, the username or email already exist');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await this.userModel.create({
      username: body.username,
      password: hashedPassword,
      email: body.email,
    });

    await this.profileModel.create({
      user: user._id,
    });
  }

  async loginUser(
    body: LoginUserDTO,
  ): Promise<{ token: string; userId: string }> {
    const findUser = await this.userModel.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });

    if (!findUser) {
      throw new NotFound('Sorry, wrong username or email');
    }
    const checkPassword = await bcrypt.compare(
      body.password,
      findUser.password,
    );

    if (!checkPassword) {
      throw new BadRequest('Wrong password, please try again');
    }

    const payload = {
      sub: findUser._id,
      username: findUser.username,
    };

    const token = this.jwtService.sign(payload);
    return { token, userId: String(findUser._id) };
  }
}
