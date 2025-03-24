import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImagesOfDebtorDto {
  @ApiProperty({
    description: 'URL of the image for the debtors',
    example:
      'https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp',
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
