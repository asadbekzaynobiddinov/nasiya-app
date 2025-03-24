import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSampleMessagesDto {
  @ApiProperty({
    description: 'Sample text',
    example: 'This is a sample message',
  })
  @IsString()
  sample: string;

  @IsOptional()
  store?: string;
}
