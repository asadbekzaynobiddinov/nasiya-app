import { Injectable } from '@nestjs/common';
import { CreateImagesOfDebtorDto } from './dto/create-images_of_debtor.dto';
import { ImagesOfDebtorsRepository } from 'src/core/repository';
import { ImagesOfDebtors } from 'src/core/entity';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';

@Injectable()
export class ImagesOfDebtorsService extends BaseService<
  CreateImagesOfDebtorDto,
  DeepPartial<ImagesOfDebtors>
> {
  constructor(
    @InjectRepository(ImagesOfDebtors) repository: ImagesOfDebtorsRepository,
  ) {
    super(repository);
  }
}
