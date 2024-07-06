import { Types, Schema } from 'mongoose';
import { IProfile } from './interfaces/profile.interface';

const ProfileSchema = new Schema<IProfile>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    displayName: { type: String, default: null },
    gender: { type: String, enum: ['Male', 'Female'], default: null },
    birthday: { type: Date, default: null },
    horoscope: { type: String, default: null },
    zodiac: { type: String, default: null },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
  },
  {
    timestamps: true,
  },
);

export default ProfileSchema;
