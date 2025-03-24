import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SampleMessagesRepository } from 'src/core/repository';
import { DeepPartial } from 'typeorm';
import { BaseService } from '../../infrastructure/lib/baseService/index';
import { CreateSampleMessagesDto } from './dto/create-sample_messages.dto';
import { SampleMessages } from '../../core/entity/index';
import { IFindOptions } from 'src/infrastructure/lib/baseService/interface';

@Injectable()
export class SampleMessagesService extends BaseService<
  CreateSampleMessagesDto,
  DeepPartial<SampleMessages>
> {
  constructor(
    @InjectRepository(SampleMessages) repository: SampleMessagesRepository,
  ) {
    super(repository);
  }

  async findAll(options?: IFindOptions<DeepPartial<SampleMessages>>): Promise<{
    status_code: number;
    message: string;
    data: DeepPartial<SampleMessages>[];
  }> {
    const allMessages = await this.getRepository.find(options);
    return {
      status_code: 200,
      message: 'success',
      data: allMessages,
    };
  }
}
