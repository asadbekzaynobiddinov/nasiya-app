import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: 'Store ID',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  @IsUUID()
  store: string;

  @ApiProperty({
    description: 'Debtor ID',
    example: 'b1eebc88-8c1c-5df7-aa7d-7cc9ad490b22',
  })
  @IsUUID()
  debtor: string;
}
