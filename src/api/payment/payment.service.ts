import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { BaseService } from 'src/infrastructure/lib/baseService';
import { DeepPartial } from 'typeorm';
import { Debt, Payments } from 'src/core/entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DebtRepository, PaymentRepository } from 'src/core/repository';
import { DebtsService } from '../debts/debts.service';
import { addMonths } from 'date-fns';
import { DebtPeriod, DebtStatus } from 'src/common/enum';

@Injectable()
export class PaymentService extends BaseService<
  CreatePaymentDto,
  DeepPartial<Payments>
> {
  constructor(
    @InjectRepository(Payments) repository: PaymentRepository,
    @InjectRepository(Debt) private readonly debtRepo: DebtRepository,
    private readonly debtsService: DebtsService,
  ) {
    super(repository);
  }

  async forMonth(forMonthPayment: CreatePaymentDto, query: any) {
    const queryRunner =
      this.getRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Oylik sonini olish
      const monthCount =
        typeof query.monthCount === 'number'
          ? query.monthCount
          : +query.monthCount;

      // 2. Qarzni olish
      const currentDebt = await this.debtsService.findOneById(
        forMonthPayment.debtId,
      );
      const debtData = currentDebt.data;

      if (!debtData) {
        throw new NotFoundException('Debt not found');
      }

      // 3. Qarz yopilgan bo'lsa, to'xtatish
      if (debtData.debt_status === DebtStatus.CLOSED) {
        await queryRunner.rollbackTransaction();
        return {
          status_code: 200,
          message: 'debt is closed',
          data: [],
        };
      }

      // 4. Yangi to‘lov yaratish
      const newPayment = this.getRepository.create({
        ...forMonthPayment,
        debt: { id: forMonthPayment.debtId },
        store: { id: forMonthPayment.storeId },
      });

      const monthlyPayment = debtData.total_debt_sum / debtData.total_month;
      const totalPayment = monthlyPayment * monthCount;

      // 5. Qarz summasi yetarli bo‘lsa, yopiladi
      if (debtData.debt_sum <= totalPayment) {
        debtData.debt_sum = 0;
        debtData.debt_status = DebtStatus.CLOSED;
        debtData.debt_period = DebtPeriod.MONTH0;
        debtData.remaining_amount = 0;
      } else {
        // Aks holda qarz kamaytiriladi
        debtData.debt_sum -= totalPayment;
        debtData.debt_period -= monthCount;

        const currentDate = debtData.next_payment_date
          ? new Date(debtData.next_payment_date as string)
          : new Date();
        const nextPaymentDate = new Date(currentDate);
        nextPaymentDate.setMonth(currentDate.getMonth() + monthCount);
        debtData.next_payment_date = nextPaymentDate
          .toISOString()
          .split('T')[0];
      }

      newPayment.sum = totalPayment;

      // 6. Saqlashlar
      await queryRunner.manager.save(newPayment);
      await queryRunner.manager.update(this.debtRepo.target, debtData.id, {
        debt_sum: debtData.debt_sum,
        debt_status: debtData.debt_status,
        debt_period: debtData.debt_period,
        next_payment_date: debtData.next_payment_date,
        remaining_amount: debtData.remaining_amount || null,
      });

      await queryRunner.commitTransaction();

      return {
        status_code: 200,
        message: 'success',
        data: newPayment,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction Failed:', error);
      throw new BadRequestException('Transaction Failed');
    } finally {
      await queryRunner.release();
    }
  }

  async forAnySum(dto: CreatePaymentDto) {
    const currentDebt = await this.debtsService.findOneById(dto.debtId);

    if (!currentDebt.data) {
      throw new NotFoundException('Debt Not Found');
    }

    if (currentDebt.data.debt_status === 'closed') {
      return {
        status_code: 200,
        message: 'debt is closed',
        data: [],
      };
    }

    const queryRunner =
      this.getRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newPayment = this.getRepository.create({
        ...dto,
        debt: { id: dto.debtId },
        store: { id: dto.storeId },
      });

      let totalPayment = newPayment.sum;
      if (currentDebt.data.remaining_amount) {
        totalPayment += +currentDebt.data.remaining_amount;
        currentDebt.data.remaining_amount = null;
      }

      const monthlyPayment =
        currentDebt.data.total_debt_sum / currentDebt.data.total_month;

      const monthsPaid = Math.floor(totalPayment / monthlyPayment);
      const remainder = totalPayment % monthlyPayment;

      let nextPaymentDate = new Date(
        currentDebt.data.next_payment_date as string,
      );

      if (+currentDebt.data.debt_sum <= totalPayment) {
        currentDebt.data.debt_sum = 0;
        currentDebt.data.debt_status = DebtStatus.CLOSED;
        currentDebt.data.debt_period = DebtPeriod.MONTH0;
        currentDebt.data.remaining_amount = 0;
      } else {
        currentDebt.data.debt_sum -= monthsPaid * monthlyPayment;

        if (monthsPaid > 0) {
          nextPaymentDate = addMonths(nextPaymentDate, monthsPaid);
          currentDebt.data.debt_period -= monthsPaid;
          currentDebt.data.next_payment_date = nextPaymentDate
            .toISOString()
            .split('T')[0];
        }

        currentDebt.data.remaining_amount = remainder;
      }

      await queryRunner.manager.save(newPayment);
      await queryRunner.manager.update(
        this.debtRepo.target,
        currentDebt.data.id,
        {
          debt_sum: currentDebt.data.debt_sum,
          debt_status: currentDebt.data.debt_status,
          debt_period: currentDebt.data.debt_period,
          next_payment_date: currentDebt.data.next_payment_date,
          remaining_amount: currentDebt.data.remaining_amount,
        },
      );

      await queryRunner.commitTransaction();

      return {
        status_code: 201,
        message: 'success',
        data: newPayment,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Transaction Failed:', error);
      throw new BadRequestException('Transaction Failed');
    } finally {
      await queryRunner.release();
    }
  }
}
