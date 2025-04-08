import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDebtorDto {
  @ApiProperty({
    example: 'Muhammadaziz Gulomov',
    description: 'Full name of the debtor',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({ example: 'toshkent', description: 'Address of the debtor' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({
    example: 'he is very angry',
    description: 'Description of the debtor',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional({ description: 'Store ID associated with the debtor' })
  @IsString()
  @IsOptional()
  store: string;

  @ApiProperty({
    example: ['+998901234567', '+998911234567'],
    description: 'List of phone numbers (minimum 1, maximum 3)',
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @Matches(/^(\+998|998|8)?(33|71|90|91|93|94|95|97|98|99)\d{7}$/, {
    each: true,
    message: 'Each phone number must be a valid Uzbekistan phone number',
  })
  phone_numbers: string[];

  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  images: string[];

  totalDebtSum?: number;
}
