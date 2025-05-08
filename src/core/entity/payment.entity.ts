import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseModel } from 'src/common/database';
import { Debt } from './debt.entity';
import { PaymentType } from 'src/common/enum';
import { Store } from './store.entity';

@Entity({ name: 'payments' })
export class Payments extends BaseModel {
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  sum: number;

  @Column({ type: 'date', default: new Date(Date.now()) })
  date: Date;

  @Column({ type: 'enum', enum: PaymentType })
  type: PaymentType;

  @ManyToOne(() => Debt, (debt) => debt.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  debt: Debt;

  @ManyToOne(() => Store, (store) => store.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  store: Store;
}
