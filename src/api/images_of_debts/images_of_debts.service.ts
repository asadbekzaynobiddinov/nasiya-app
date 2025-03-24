import { Injectable } from '@nestjs/common';
import { CreateImagesOfDebtDto } from './dto/create-images_of_debt.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { ImagesOfDebts } from 'src/core/entity';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ImagesOfDebtsRepository } from 'src/core/repository';

@Injectable()
export class ImagesOfDebtsService extends BaseService<
  CreateImagesOfDebtDto,
  DeepPartial<ImagesOfDebts>
> {
  constructor(
    @InjectRepository(ImagesOfDebts) repository: ImagesOfDebtsRepository,
  ) {
    super(repository);
  }
}
