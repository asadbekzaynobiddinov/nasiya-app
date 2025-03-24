import { BaseService } from 'src/infrastructure/lib/baseService';
import { CreateMessagesDto } from './dto/create-messages.dto';
import { Messages } from 'src/core/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesRepository } from '../../core/repository/index';
import { IFindOptions } from 'src/infrastructure/lib/baseService/interface';

export class MessagesService extends BaseService<CreateMessagesDto, Messages> {
  constructor(@InjectRepository(Messages) repository: MessagesRepository) {
    super(repository);
  }

  async findAll(
    options?: IFindOptions<Messages>,
  ): Promise<{ status_code: number; message: string; data: Messages[] }> {
    const allMessages = await this.getRepository.find(options);
    return {
      status_code: 200,
      message: 'success',
      data: allMessages,
    };
  }
}
