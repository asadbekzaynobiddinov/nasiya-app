import { PartialType } from '@nestjs/swagger';
import { CreateStoresDto } from './create-store.dto';

export class UpdateStoresDto extends PartialType(CreateStoresDto) {}
