import { Module } from '@nestjs/common';
import { ImagesOfDebtorsService } from './images_of_debtors.service';
import { ImagesOfDebtorsController } from './images_of_debtors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesOfDebtors } from 'src/core/entity';

@Module({
  imports: [TypeOrmModule.forFeature([ImagesOfDebtors])],
  controllers: [ImagesOfDebtorsController],
  providers: [ImagesOfDebtorsService],
})
export class ImagesOfDebtorsModule {}
