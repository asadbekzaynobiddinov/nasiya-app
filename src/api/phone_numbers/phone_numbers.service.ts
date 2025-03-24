import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { PhoneNumbersOfDebtors } from 'src/core/entity/index';
import { PhoneNumbersOfDebtorsRepository } from 'src/core/repository/index';
import { PhoneNumberDto } from './dto/create-phone.dto';

@Injectable()
export class PhoneNumbersService extends BaseService<
  PhoneNumberDto,
  DeepPartial<PhoneNumbersOfDebtors>
> {
  constructor(
    @InjectRepository(PhoneNumbersOfDebtors)
    repository: PhoneNumbersOfDebtorsRepository,
  ) {
    super(repository);
  }
}
