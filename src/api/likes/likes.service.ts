import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { BaseService } from '../../infrastructure/lib/baseService';
import { DeepPartial } from 'typeorm';
import { Likes } from 'src/core/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LikesRepository } from 'src/core/repository';
import { StoreService } from '../store/store.service';
import { DebtorService } from '../debtor/debtor.service';

@Injectable()
export class LikesService extends BaseService<
  CreateLikeDto,
  DeepPartial<Likes>
> {
  constructor(
    @InjectRepository(Likes) repository: LikesRepository,
    private readonly debtorService: DebtorService,
    private readonly storeService: StoreService,
  ) {
    super(repository);
  }
  async create(dto: CreateLikeDto) {
    try {
      await this.storeService.findOne(dto.store);
      await this.debtorService.findOneBy({
        where: { id: dto.debtor },
      });
      let created_data = (await this.getRepository.create({
        ...dto,
      })) as Likes;
      created_data = await this.getRepository.save(created_data);
      return {
        status_code: 201,
        message: 'success',
        data: created_data,
      };
    } catch (error) {
      console.error(error);
    }
  }
}
