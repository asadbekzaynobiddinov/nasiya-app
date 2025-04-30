import { Cron } from '@nestjs/schedule';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { CreateMessagesDto } from './dto/create-messages.dto';
import { Messages } from 'src/core/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesRepository } from '../../core/repository/index';
import { IFindOptions } from 'src/infrastructure/lib/baseService/interface';
import { MessageStatus } from 'src/common/enum';

export class MessagesService extends BaseService<CreateMessagesDto, Messages> {
  constructor(@InjectRepository(Messages) repository: MessagesRepository) {
    super(repository);
  }

  @Cron('0 20 * * *', {
    timeZone: 'Asia/Tashkent',
  })
  sendMessage() {
    console.log('Cron ishladi');
    /**
     * Sends a message to debtors.
     * This method is responsible for notifying debtors with relevant information.
     */
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

  async create(
    dto: CreateMessagesDto,
  ): Promise<{ status_code: number; message: string; data: Messages }> {
    const newMessage = this.getRepository.create({
      message: dto.message,
      status: MessageStatus.PENDING,
      store: {
        id: dto.store_id,
      },
      debtor: {
        id: dto.debtor_id,
      },
    });

    /**
    
    This place for send message logics
     
    **/
    await this.getRepository.save(newMessage);

    return {
      status_code: 200,
      message: 'success',
      data: {
        ...newMessage,
        phone_number: dto.phone_number,
      },
    };
  }
}
