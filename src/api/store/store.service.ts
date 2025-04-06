import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoresDto } from './dto/create-store.dto';
import { Debt, Debtor, Store } from '../../core/entity';
import {
  DebtorRepository,
  DebtRepository,
  StoreRepository,
} from '../../core/repository/index';
import { BcryptManage } from '../../infrastructure/lib/bcrypt/index';
import { UpdateStoresDto } from './dto/update-store.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store) private readonly repository: StoreRepository,
    @InjectRepository(Debtor)
    private readonly debtorRepository: DebtorRepository,
    @InjectRepository(Debt) private readonly debtRepository: DebtRepository,
    private readonly manageBcrypt: BcryptManage,
  ) {}
  async create(cerateStoreDto: CreateStoresDto): Promise<{
    status_code: number;
    message: string;
    data: Omit<Store, 'hashed_password'>;
  }> {
    const storeLogin = await this.repository.findOne({
      where: { login: cerateStoreDto.login },
    });
    const storeEmail = await this.repository.findOne({
      where: { email: cerateStoreDto.email },
    });
    const storePhone = await this.repository.findOne({
      where: { phone_number: cerateStoreDto.phone_number },
    });
    if (storeLogin) {
      throw new BadRequestException('login already exist!');
    } else if (storePhone) {
      throw new BadRequestException('Phone number already exist!');
    } else if (storeEmail) {
      throw new BadRequestException('Email already exist!');
    }
    const hashPassword = await this.manageBcrypt.createBcryptPassword(
      cerateStoreDto.hashed_password,
    );
    cerateStoreDto.hashed_password = hashPassword;
    const create_store = this.repository.create(cerateStoreDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashed_password, ...newStore } =
      await this.repository.save(create_store);
    return {
      status_code: 200,
      message: 'success',
      data: newStore,
    };
  }

  async findStoreByDate(
    id: string,
    data: { start_date: Date; end_date: Date },
  ): Promise<{
    status_code: number;
    message: string;
    data: any;
  }> {
    if (!data?.start_date && !data?.end_date) {
      throw new Error('Date is required!');
    }
    const totalDebtSum = await this.repository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.debtors', 'debtor')
      .leftJoinAndSelect('debtor.debts', 'debt')
      .select('debt.total_debt_sum, debt.total_month', 'total_month')
      .where('store.id = :id', { id })
      .andWhere('DATE(debt.next_payment_date) >= DATE(:startDate)', {
        startDate: data.start_date,
      })
      .andWhere('DATE(debt.next_payment_date) <= DATE(:endDate)', {
        endDate: data.end_date,
      })
      .getRawMany();
    if (!totalDebtSum || totalDebtSum.length === 0) {
      throw new NotFoundException('not found!');
    }
    let totalOneMonthDebt = 0;
    totalDebtSum.forEach((element) => {
      totalOneMonthDebt += +element.total_debt_sum / element.total_month;
    });
    return {
      status_code: 200,
      message: 'success',
      data: totalOneMonthDebt.toFixed(2),
    };
  }

  async paymentDays(id: string) {
    const dates = await this.repository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.debtors', 'debtor')
      .leftJoinAndSelect('debtor.debts', 'debt')
      .select('debt.next_payment_date')
      .where('store.id = :id', { id })
      .andWhere('debt.debt_status = :status', { status: 'active' })
      .getRawMany();
    const result = dates.map(
      (date) => date.debt_next_payment_date.toISOString().split('T')[0],
    );
    return {
      status_code: 200,
      message: 'success',
      dates: result,
    };
  }

  async findStoreByDateOne(
    id: string,
    datas: Date,
  ): Promise<{
    status_code: number;
    message: string;
    total_day_debt: string;
    data: any;
  }> {
    if (!datas) {
      throw new Error('Date is required!');
    }
    const totalDebtSum = await this.repository
      .createQueryBuilder('store')
      .leftJoinAndSelect('store.debtors', 'debtor')
      .leftJoinAndSelect('debtor.debts', 'debt')
      .select('debt.total_debt_sum, total_month, debtor.full_name')
      .where('store.id = :id', { id })
      .andWhere('DATE(debt.next_payment_date) = DATE(:oneDate)', {
        oneDate: datas,
      })
      .getRawMany();

    if (!totalDebtSum || totalDebtSum.length === 0) {
      return {
        status_code: 200,
        message: 'success',
        total_day_debt: '',
        data: [],
      };
    }
    let totalOnedayDebt = 0;
    totalDebtSum.forEach((element) => {
      totalOnedayDebt += +element.total_debt_sum / element.total_month;
    });
    return {
      status_code: 200,
      message: 'success',
      total_day_debt: totalOnedayDebt.toFixed(2),
      data: totalDebtSum,
    };
  }

  async findAll(): Promise<{
    status_code: number;
    message: string;
    data: Store[];
  }> {
    const allStore = await this.repository.find({
      select: {
        id: true,
        login: true,
        wallet: true,
        image: true,
        phone_number: true,
        pin_code: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (allStore.length === 0) {
      throw new NotFoundException('Store is not found!');
    }
    return {
      status_code: 200,
      message: 'success',
      data: allStore,
    };
  }

  async findOne(id: string): Promise<{
    status_code: number;
    message: string;
    data: Store;
  }> {
    const findOneStore = await this.repository.findOne({
      where: { id },
      select: {
        id: true,
        login: true,
        wallet: true,
        image: true,
        phone_number: true,
        pin_code: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });
    if (!findOneStore) {
      throw new NotFoundException('Store is not found!');
    }
    return {
      status_code: 200,
      message: 'success',
      data: findOneStore,
    };
  }

  async findByLogin(login: string): Promise<{
    status_code: number;
    message: string;
    data: Store;
  }> {
    const store = await this.repository.findOne({ where: { login } });
    if (!store) {
      throw new BadRequestException('login or password not found!');
    }
    return {
      status_code: 200,
      message: 'success',
      data: store,
    };
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoresDto,
  ): Promise<{
    status_code: number;
    message: string;
    data: Store;
  }> {
    await this.findOne(id);
    await this.repository.update(id, updateStoreDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{
    status_code: number;
    message: string;
    data: any;
  }> {
    const storeData = await this.findOne(id);
    if (!storeData) {
      throw new NotFoundException('Store is not found!');
    }
    const deleteStore = await this.repository.delete({ id });
    if (deleteStore.affected == 1) {
      return {
        status_code: 200,
        message: 'successfully deleted',
        data: {},
      };
    } else {
      return {
        status_code: 200,
        message: 'an error occurred during shutdown',
        data: {},
      };
    }
  }

  // async getTotalSumOfStore(storeId: string): Promise<object> {
  //   const totalDebt = await this.debtorRepository
  //     .createQueryBuilder('debtor')
  //     .leftJoin('debtor.debts', 'debt')
  //     .where('debtor.storeId = :storeId', { storeId })
  //     .select('SUM(debt.debt_sum)', 'total')
  //     .getRawOne();

  //   return {
  //     code_status: 200,
  //     message: 'success',
  //     data: Number(totalDebt.total) || 0,
  //   };
  // }

  // async getDebtorsCountByStore(storeId: string): Promise<object> {
  //   const debtorCount = await this.debtorRepository
  //     .createQueryBuilder('debtor')
  //     .where('debtor.storeId = :storeId', { storeId })
  //     .getCount();

  //   return {
  //     code_status: 200,
  //     message: 'success',
  //     data: debtorCount,
  //   };
  // }

  // async getLateDebtsCountByStore(storeId: string): Promise<object> {
  //   const currentDate = new Date();

  //   const lateDebtsCount = await this.debtRepository
  //     .createQueryBuilder('debt')
  //     .leftJoin('debt.debtor', 'debtor')
  //     .where('debtor.storeId = :storeId', { storeId })
  //     .andWhere('debt.next_payment_date < :currentDate', { currentDate })
  //     .getCount();

  //   return {
  //     code_status: 200,
  //     message: 'success',
  //     data: { 'total late debts count': lateDebtsCount },
  //   };
  // }

  async storeStatistics(id: string) {
    try {
      const totalDebt = await this.debtorRepository
        .createQueryBuilder('debtor')
        .leftJoin('debtor.debts', 'debt')
        .where('debtor.storeId = :id', { id })
        .select('COALESCE(SUM(debt.debt_sum), 0)', 'total')
        .getRawOne();

      const debtorCount = await this.debtorRepository
        .createQueryBuilder('debtor')
        .where('debtor.storeId = :id', { id })
        .getCount();

      const currentDate = new Date();

      const lateDebtsCount = await this.debtRepository
        .createQueryBuilder('debt')
        .leftJoin('debt.debtor', 'debtor')
        .where('debtor.storeId = :id', { id })
        .andWhere('debt.next_payment_date < :currentDate', { currentDate })
        .getCount();

      const image = await this.repository
        .createQueryBuilder('store')
        .where('store.id = :id', { id })
        .select('store.image', 'image')
        .getRawOne();
      return {
        code_status: 200,
        message: 'success',
        data: {
          image: image.image,
          totalDebt: totalDebt.total,
          debtorCount,
          lateDebtsCount,
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
