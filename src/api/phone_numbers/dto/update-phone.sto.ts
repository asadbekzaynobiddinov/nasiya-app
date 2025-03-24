import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { PhoneNumberDto } from './create-phone.dto';

export class UpdatePhoneNumberDto extends PartialType(PhoneNumberDto) {
  @ApiProperty({
    description: 'The updated phone number of the debtor',
    example: '+998901234567',
    required: false,
  })
  @IsString({ message: 'Phone number must be a string' })
  @IsOptional()
  phone_number?: string;
}
