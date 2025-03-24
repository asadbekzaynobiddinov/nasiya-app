import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Unique username of the admin',
    example: 'admin007',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Hashed password of the admin',
    example: '$2b$10$S6IQHY1rMLdtTcrBpJ1p7O2xw7JhwfLO6rcJZ5fzzlTG9AeDNhV8a',
  })
  @IsString()
  @IsNotEmpty()
  hashed_password: string;

  @ApiProperty({
    description: 'Phone number of the admin',
    example: '+998 90 123 45 67',
  })
  @IsString()
  @IsOptional()
  @MinLength(9)
  phone_number?: string;
}
