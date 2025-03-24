import { PartialType } from '@nestjs/swagger';
import { CreateMessagesDto } from './create-messages.dto';

export class UpdateMessagesDto extends PartialType(CreateMessagesDto) {}
