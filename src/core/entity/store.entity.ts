import { Entity, Column, OneToMany } from 'typeorm';
import { BaseModel } from '../../common/database/index';
import { Debtor } from './debtor.entity';
import { SampleMessages } from './sample.message.entity';
import { Messages } from './message.entity';
import { Likes } from './likes.entity';
import { Payments } from './payment.entity';

@Entity({ name: 'stores' })
export class Store extends BaseModel {
  @Column({ unique: true })
  login: string;

  @Column()
  full_name: string;

  @Column()
  hashed_password: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  wallet: number;

  @Column({ nullable: true })
  image: string;

  @Column()
  pin_code: number;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @OneToMany(() => Debtor, (debtor) => debtor.store)
  debtors: Debtor[];

  @OneToMany(() => SampleMessages, (sample) => sample.store)
  sample_messages: SampleMessages[];

  @OneToMany(() => Messages, (messages) => messages.store)
  messages: Messages[];

  @OneToMany(() => Likes, (likes) => likes.store)
  likes: Likes[];

  @OneToMany(() => Payments, (payment) => payment.store)
  payments: Payments[];
}
