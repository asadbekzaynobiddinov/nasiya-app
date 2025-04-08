import { BaseService } from 'src/infrastructure/lib/baseService';
import { CreateDebtorDto } from './dto/create-debtor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import {
  Debtor,
  ImagesOfDebtors,
  PhoneNumbersOfDebtors,
} from '../../core/entity/index';
import {
  DebtorRepository,
  ImagesOfDebtorsRepository,
  PhoneNumbersOfDebtorsRepository,
} from '../../core/repository/index';
import { IFindOptions } from 'src/infrastructure/lib/baseService/interface';

export class DebtorService extends BaseService<
  CreateDebtorDto,
  DeepPartial<Debtor>
> {
  constructor(
    @InjectRepository(Debtor) repository: DebtorRepository,
    @InjectRepository(PhoneNumbersOfDebtors)
    private readonly phoneRepo: PhoneNumbersOfDebtorsRepository,
    @InjectRepository(ImagesOfDebtors)
    private readonly imagesRepo: ImagesOfDebtorsRepository,
  ) {
    super(repository);
  }

  async create(dto: CreateDebtorDto): Promise<{
    status_code: number;
    message: string;
    data: DeepPartial<Debtor>;
  }> {
    const newDebtor = this.getRepository.create(dto);
    await this.getRepository.save(newDebtor);

    const phoneTransaction =
      this.phoneRepo.manager.connection.createQueryRunner();

    await phoneTransaction.connect();
    await phoneTransaction.startTransaction();
    try {
      for (const phone_number of dto.phone_numbers) {
        const newPhone = this.phoneRepo.create({
          debtor: { id: newDebtor.id },
          phone_number: phone_number,
        });
        await phoneTransaction.manager.save(newPhone);
      }

      await phoneTransaction.commitTransaction();
    } catch (error) {
      await phoneTransaction.rollbackTransaction();

      return {
        status_code: 400,
        message:
          'Error occurred while creating debtor and phone numbers' +
          error.message,
        data: null,
      };
    } finally {
      await phoneTransaction.release();
    }

    const imageTransaction =
      this.imagesRepo.manager.connection.createQueryRunner();

    await imageTransaction.connect();
    await imageTransaction.startTransaction();
    try {
      for (const image of dto.images) {
        const newImage = this.imagesRepo.create({
          debtor: { id: newDebtor.id },
          image: image,
        });
        await this.imagesRepo.save(newImage);
      }
      await imageTransaction.commitTransaction();
    } catch (error) {
      await imageTransaction.rollbackTransaction();

      return {
        status_code: 400,
        message:
          'Error occurred while creating debtor and images' + error.message,
        data: null,
      };
    } finally {
      await imageTransaction.release();
    }

    delete newDebtor.images;
    delete newDebtor.phone_numbers;

    return {
      status_code: 201,
      message: 'success',
      data: newDebtor,
    };
  }

  async findAll(options?: IFindOptions<DeepPartial<Debtor>>): Promise<{
    status_code: number;
    message: string;
    data: DeepPartial<Debtor>[];
  }> {
    const allDebtors = await this.getRepository.find(options);

    const debtors = allDebtors.map((debtor) => {
      const totalDebtSum = debtor.debts.reduce((acc, debt) => {
        return acc + parseFloat(debt.debt_sum);
      }, 0);
      return {
        ...debtor,
        totalDebtSum,
      };
    });

    return {
      status_code: 200,
      message: 'success',
      data: debtors,
    };
  }

  async findOneById(
    id: string,
    options?: IFindOptions<DeepPartial<Debtor>>,
  ): Promise<{
    status_code: number;
    message: string;
    data: DeepPartial<Debtor>;
  }> {
    const debtor = await this.getRepository.findOne({
      where: { id, store: options.where },
    });
    return {
      status_code: 200,
      message: 'success',
      data: debtor,
    };
  }

  async delete(
    id: string,
  ): Promise<{ status_code: number; message: string; data: any }> {
    const debt = await this.getRepository.findOne({ where: { id } });
    if (!debt) {
      return {
        status_code: 404,
        message: 'debtor not found',
        data: {},
      };
    }
    await this.getRepository.delete(id);
    return {
      status_code: 200,
      message: 'debttor deleted sucsesfuly',
      data: {},
    };
  }
}
