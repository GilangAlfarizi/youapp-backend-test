import { Types } from 'mongoose';

export class UpdateProfileDTO {
  user: Types.ObjectId | string;
  displayName?: string;
  gender?: 'Male' | 'Female' | string;
  birthday?: string;
  height?: number;
  weight?: number;
}
