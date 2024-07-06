import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MongooseConfigService } from './db/db.config';
import { JwtModule, JwtService } from '@nestjs/jwt';

export const jwtConstants = {
  secret: 'test',
};
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://127.0.0.1:27017/youapp_test`),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6h' },
    }),
  ],
  controllers: [UserController],
  providers: [MongooseConfigService, UserService, JwtService],
})
export class AppModule {}
