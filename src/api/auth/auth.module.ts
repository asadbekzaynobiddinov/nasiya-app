import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StoreModule } from '../store/store.module';
import { BcryptManage } from '../../infrastructure/lib/bcrypt/index';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [StoreModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [AuthService, BcryptManage],
})
export class AuthModule {}
