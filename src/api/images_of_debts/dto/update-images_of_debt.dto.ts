import { PartialType } from '@nestjs/mapped-types';
import { CreateImagesOfDebtDto } from './create-images_of_debt.dto';

export class UpdateImagesOfDebtDto extends PartialType(CreateImagesOfDebtDto) {}
