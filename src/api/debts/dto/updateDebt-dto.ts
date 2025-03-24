import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { DebtPeriod } from 'src/common/enum';

export class UpdateDebtDto {
  @ApiPropertyOptional({
    description: 'The date when the debt was created',
    example: '2025-01-22',
  })
  @IsOptional()
  @IsDateString()
  debt_date?: string;

  @ApiPropertyOptional({
    description: 'The payment period for the debt',
    enum: DebtPeriod,
    example: DebtPeriod.MONTH3,
  })
  @IsOptional()
  @IsEnum(DebtPeriod)
  debt_period?: DebtPeriod;

  @ApiPropertyOptional({
    description: 'The debt amount',
    example: 1500.75,
    type: 'number',
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '2', force_decimal: false })
  debt_sum?: number;

  @ApiPropertyOptional({
    description: 'A description of the debt',
    example: 'Debt for January 2025',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The ID of the debtor',
    example: 'debtor-12345',
  })
  @IsOptional()
  debtor?: string;
}
