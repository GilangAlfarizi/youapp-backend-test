import { Module } from '@nestjs/common';
import { MongooseConfigService } from '../db/db.config';
import { JwtModule } from '@nestjs/jwt';
import { ProfileController } from 'src/controllers/profile.controller';
import { ProfileService } from 'src/services/profile.service';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_KEY}`,
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfileService, MongooseConfigService],
})
export class ProfileModule {}
