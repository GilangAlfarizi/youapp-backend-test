import { Types } from 'mongoose';
import { PipelineBuilder } from '../utils/pipeline.util';

export const getUserProfileDetailPipeline = (id: string) => {
  const userId = new Types.ObjectId(id);
  return new PipelineBuilder()
    .match({
      user: userId,
    })
    .lookup({
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'users',
    })
    .unwind('$users')
    .project({
      _id: 1,
      username: '$users.username',
      displayName: 1,
      gender: 1,
      birthday: 1,
      horoscope: 1,
      zodiac: 1,
      height: 1,
      weight: 1,
    })
    .build();
};
