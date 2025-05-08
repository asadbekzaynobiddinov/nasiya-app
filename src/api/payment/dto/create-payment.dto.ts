import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { PaymentType } from '../../../common/enum';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'Payment amount',
    example: 150.25,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  sum: number;

  @ApiProperty({
    description: 'Payment type',
    enum: PaymentType,
  })
  @IsNotEmpty()
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({
    description: 'Associated Debt ID',
    example: 'b7c8f1e2-3d4f-5a6b-7c8d-9e0f1a2b3c4d',
  })
  @IsUUID()
  debtId: string;

  @IsOptional()
  storeId: string;
}
