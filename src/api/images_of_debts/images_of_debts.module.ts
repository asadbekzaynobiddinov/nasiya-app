import { Module } from '@nestjs/common';
import { ImagesOfDebtsService } from './images_of_debts.service';
import { ImagesOfDebtsController } from './images_of_debts.controller';
import { ImagesOfDebts } from 'src/core/entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesOfDebts])],
  controllers: [ImagesOfDebtsController],
  providers: [ImagesOfDebtsService],
  exports: [ImagesOfDebtsService],
})
export class ImagesOfDebtsModule {}
