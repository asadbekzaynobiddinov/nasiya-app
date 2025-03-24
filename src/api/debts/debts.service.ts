import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { DebtRepository } from 'src/core/repository/index';
import { DebtDto } from './dto/createDebt-dto';
import { ImagesOfDebtsService } from '../images_of_debts/images_of_debts.service';
import { Debt } from 'src/core/entity';
// import { IFindOptions } from 'src/infrastructure/lib/baseService/interface';

@Injectable()
export class DebtsService extends BaseService<DebtDto, DeepPartial<Debt>> {
  constructor(
    @InjectRepository(Debt) repository: DebtRepository,
    private readonly imagesOfDebts: ImagesOfDebtsService,
  ) {
    super(repository);
  }

  async create(dto: DebtDto): Promise<{
    status_code: number;
    message: string;
    data: DeepPartial<Debt>;
  }> {
    const { images, ...createDebtsDto } = dto;
    const queryRunner =
      this.getRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newDebt = this.getRepository.create(createDebtsDto);
      newDebt.total_debt_sum = newDebt.debt_sum;
      newDebt.total_month = newDebt.debt_period;
      newDebt.next_payment_date = new Date();
      newDebt.next_payment_date.setMonth(
        newDebt.next_payment_date.getMonth() + 1,
      );

      await queryRunner.manager.save(newDebt);

      for (const image of images) {
        const newImage = this.imagesOfDebts.getRepository.create({
          debt: { id: newDebt.id },
          image: image,
        });
        await queryRunner.manager.save(newImage);
      }

      await queryRunner.commitTransaction();

      return {
        status_code: 201,
        message: 'success',
        data: newDebt,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
