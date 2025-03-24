import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageStatus } from '../../../common/enum/index';

export class CreateMessagesDto {
  @ApiProperty({
    description: 'The content of the message',
    example: 'This is a sample message.',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'The status of the message',
    enum: MessageStatus,
    example: MessageStatus.SENT,
  })
  @IsEnum(MessageStatus)
  status: MessageStatus;

  @ApiPropertyOptional({
    description: 'Optional store identifier',
    example: 'Store123',
  })
  @IsOptional()
  store: string;
}
