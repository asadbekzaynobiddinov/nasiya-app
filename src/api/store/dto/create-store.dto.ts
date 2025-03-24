import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { IsPhoneNumber } from '../../../common/decorator/is-phone-number';

export class CreateStoresDto {
  @ApiProperty({
    example: 'john doe',
    description: 'full name for the owner of the store',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  full_name: string;

  @ApiProperty({
    type: String,
    description: 'Phone number of store',
    example: '+998901234567',
  })
  @IsPhoneNumber()
  phone_number: string;

  @ApiProperty({
    example: 'exampl@exampl.com',
    description: 'email for the owner of the store',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'johndoe',
    description: 'login for the owner of the store',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  login: string;

  @ApiProperty({
    example: 'qwert12345',
    description: 'hashed_password of the store',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  hashed_password: string;

  @ApiProperty({ example: 1234, description: '4-digit PIN code for the store' })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  pin_code: number;
}
