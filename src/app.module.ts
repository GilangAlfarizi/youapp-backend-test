import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './db/db.config';
import { JwtService } from '@nestjs/jwt';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { AuthModule } from './modules/auth.module';
import { UserService } from './services/user.service';
import { ProfileModule } from './modules/profile.module';

@Module({
  imports: [AuthModule, ProfileModule],
})
export class AppModule {}
