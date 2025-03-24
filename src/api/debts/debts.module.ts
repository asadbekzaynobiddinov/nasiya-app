import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebtsController } from './debts.controller';
import { DebtsService } from './debts.service';
import { Debt } from 'src/core/entity';
import { ImagesOfDebtsModule } from '../images_of_debts/images_of_debts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Debt]), ImagesOfDebtsModule],
  controllers: [DebtsController],
  providers: [DebtsService],
  exports: [DebtsService],
})
export class DebtsModule {}
