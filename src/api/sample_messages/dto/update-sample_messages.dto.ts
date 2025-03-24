import { PartialType } from '@nestjs/swagger';
import { CreateSampleMessagesDto } from './create-sample_messages.dto';

export class UpdateSampleMessagesDto extends PartialType(
  CreateSampleMessagesDto,
) {}
