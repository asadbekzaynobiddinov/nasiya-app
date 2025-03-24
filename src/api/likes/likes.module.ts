import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from 'src/core/entity';
import { StoreModule } from '../store/store.module';
import { DebtorModule } from '../debtor/debtor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Likes]), StoreModule, DebtorModule],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
