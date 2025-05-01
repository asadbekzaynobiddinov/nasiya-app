import { Cron } from '@nestjs/schedule';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { CreateMessagesDto } from './dto/create-messages.dto';
import { Messages } from 'src/core/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesRepository } from '../../core/repository/index';
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

    const currentMessage = await this.getRepository.findOne({
      where: { id: newMessage.id },
      relations: ['debtor', 'debtor.phone_numbers'],
    });

    return {
      status_code: 200,
      message: 'success',
      data: currentMessage,
    };
  }

  async debtorsMessages(id: string) {
    const messages = await this.getRepository.find({
      where: { debtor: { id } },
      relations: ['debtor', 'debtor.phone_numbers'],
    });
    return {
      status_code: 200,
      messages: 'succes',
      data: messages,
    };
  }

  async chats(storeId: string) {
    try {
      const messages = await this.getRepository
        .createQueryBuilder('message')
        .innerJoin(
          (qb) => {
            return qb
              .select('MAX(sub."created_at")', 'maxcreated_at')
              .addSelect('sub."debtorId"', 'debtorId')
              .from(Messages, 'sub')
              .where('sub."storeId" = :storeId', { storeId })
              .groupBy('sub."debtorId"');
          },
          'latest',
          `
        latest."debtorId" = message."debtorId" 
        AND latest."maxcreated_at" = message."created_at"
      `,
        )
        .leftJoinAndSelect('message.debtor', 'debtor')
        .leftJoinAndSelect('debtor.phone_numbers', 'phone_numbers')
        .orderBy('message.created_at', 'DESC')
        .getMany();

      return {
        status_code: 200,
        message: 'success',
        data: messages,
      };
    } catch (error) {
      console.log(error.message);
    }
  }
}
