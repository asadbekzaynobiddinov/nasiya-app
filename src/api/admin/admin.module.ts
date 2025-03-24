import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '../../core/entity/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BcryptManage } from 'src/infrastructure/lib/bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService, BcryptManage],
})
export class AdminModule {}
