import { Module } from '@nestjs/common';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { MongooseConfigService } from '../db/db.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_KEY}`,
      signOptions: { expiresIn: '1m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MongooseConfigService],
})
export class AuthModule {}
