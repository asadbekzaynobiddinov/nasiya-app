import { PartialType } from '@nestjs/mapped-types';
import { CreateImagesOfDebtorDto } from './create-images_of_debtor.dto';

export class UpdateImagesOfDebtorDto extends PartialType(
  CreateImagesOfDebtorDto,
) {}
