import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImagesOfDebtDto {
  @ApiProperty({
    description: 'URL of the image of the debts',
    example:
      'https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp',
  })
  @IsString()
  @IsNotEmpty()
  image: string;
}
