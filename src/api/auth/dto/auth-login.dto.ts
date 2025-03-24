import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    example: 'Muhammadaziz',
    description: 'store enter login',
  })
  @IsString()
  login: string;

  @ApiProperty({
    example: 'Qwert1234',
    description: 'store enter password',
  })
  @IsString()
  hashed_password: string;
}
