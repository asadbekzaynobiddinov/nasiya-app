import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMessagesDto {
  @ApiProperty({
    description: 'The content of the message',
    example: 'This is a sample message.',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    description: 'Optional store identifier',
    example: 'Store123',
  })
  @IsOptional()
  store_id: string;

  @ApiProperty({
    description: 'debter number',
    example: '+998907875101',
  })
  @IsString()
  phone_number: string;

  @ApiProperty({
    description: 'Debtor id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID()
  debtor_id: string;
}
