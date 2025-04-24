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
      // take month count by query
      let monthCount: number;
      if (typeof query.monthCount !== 'number') {
        monthCount = +query.monthCount;
      } else {
        monthCount = query.monthCount;
      }

      //save new payment
      const newPayment = await this.getRepository.create(forMonthPayment);
      await this.getRepository.save(newPayment);

      // update debts' next payment date
      const currentDebt = await this.debtsService.findOneById(
        forMonthPayment.debtId,
      );
      const currentDebtDate = currentDebt.data.next_payment_date
        ? new Date(
            currentDebt.data.next_payment_date as unknown as string | number,
          )
        : new Date();
      currentDebtDate.setMonth(currentDebtDate.getMonth() + monthCount);

      currentDebt.data.debt_period -= monthCount;

      await this.debtsService.update(forMonthPayment.debtId, {
        next_payment_date: currentDebtDate,
        debt_sum: currentDebt.data.debt_sum - forMonthPayment.sum,
        debt_period: currentDebt.data.debt_period,
      });
      return {
        status_code: 200,
        message: 'success',
        data: newPayment,
      };
    } catch (error) {
      console.log(error);

      await queryRunner.rollbackTransaction();
      throw error;
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
      throw new BadRequestException('Debt Is Closed');
    }

    const queryRunner =
      this.getRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newPayment = this.getRepository.create(dto);

      const monthlyPayment =
        currentDebt.data.debt_sum / currentDebt.data.debt_period;
      const monthsPaid = Math.floor(newPayment.sum / monthlyPayment);

      let nextPaymentDate = new Date(
        currentDebt.data.next_payment_date as string,
      );

      if (+currentDebt.data.debt_sum <= newPayment.sum) {
        currentDebt.data.debt_sum = 0;
        currentDebt.data.debt_status = DebtStatus.CLOSED;
        currentDebt.data.debt_period = DebtPeriod.MONTH0;
      } else {
        currentDebt.data.debt_sum -= newPayment.sum;

        if (monthsPaid > 0) {
          nextPaymentDate = addMonths(nextPaymentDate, monthsPaid);
          currentDebt.data.debt_period -= monthsPaid;
          currentDebt.data.next_payment_date = nextPaymentDate
            .toISOString()
            .split('T')[0];
        }
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
