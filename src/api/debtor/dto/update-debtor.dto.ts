import { PartialType } from '@nestjs/swagger';
import { CreateDebtorDto } from './create-debtor.dto';
import { IsArray, IsOptional } from 'class-validator';

export class UpdateDebtorDto extends PartialType(CreateDebtorDto) {
  @IsOptional()
  @IsArray()
  numbers?: {
    id: string;
    phone_number: string;
  }[];

  @IsOptional()
  @IsArray()
  pictures: {
    id: string;
    url: string;
  }[];
}
