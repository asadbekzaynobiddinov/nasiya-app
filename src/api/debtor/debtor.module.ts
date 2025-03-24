import { Module } from '@nestjs/common';
import { DebtorController } from './debtor.controller';
import { DebtorService } from './debtor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Debtor,
  ImagesOfDebtors,
  PhoneNumbersOfDebtors,
} from 'src/core/entity';
import { PhoneNumbersService } from '../phone_numbers/phone_numbers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Debtor, PhoneNumbersOfDebtors, ImagesOfDebtors]),
  ],
  controllers: [DebtorController],
  providers: [DebtorService, PhoneNumbersService],
  exports: [DebtorService],
})
export class DebtorModule {}
