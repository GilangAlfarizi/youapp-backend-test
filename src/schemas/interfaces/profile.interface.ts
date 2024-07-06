import { Types } from 'mongoose';

export interface IProfile {
  _id?: string | Types.ObjectId;
  user?: string | Types.ObjectId;
  displayName?: string;
  gender?: 'Male' | 'Female';
  birthday?: Date;
  horoscope?: string;
  zodiac?: string;
  height?: number;
  weight?: number;
}
