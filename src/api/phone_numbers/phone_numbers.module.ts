import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneNumbersController } from './phone_numbers.controller';
import { PhoneNumbersService } from './phone_numbers.service';
import { PhoneNumbersOfDebtors } from 'src/core/entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhoneNumbersOfDebtors])],
  controllers: [PhoneNumbersController],
  providers: [PhoneNumbersService],
})
export class PhoneNumbersModule {}
