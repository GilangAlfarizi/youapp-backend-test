import { Types } from 'mongoose';

export interface IUser {
  _id?: string | Types.ObjectId;
  username?: string;
  email?: string;
  password?: string;
}
