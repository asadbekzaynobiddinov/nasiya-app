import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Debt, Payments } from '../../core/entity';
import { DebtsModule } from '../debts/debts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payments, Debt]), DebtsModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
