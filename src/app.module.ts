import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './db/db.config';
import { JwtService } from '@nestjs/jwt';
import { ProfileController } from './controllers/profile.controller';
import { ProfileService } from './services/profile.service';
import { AuthModule } from './auth/auth.module';
import { UserService } from './services/user.service';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://127.0.0.1:27017/youapp_test`),
    AuthModule,
  ],
  controllers: [ProfileController],
  providers: [MongooseConfigService, JwtService, ProfileService, UserService],
})
export class AppModule {}
