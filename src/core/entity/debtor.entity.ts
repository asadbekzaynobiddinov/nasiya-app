import { Entity, Column, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseModel } from '../../common/database/index';
import { Store } from './store.entity';
import { Debt } from './debt.entity';
import { Messages } from './message.entity';
import { Likes } from './likes.entity';
import { PhoneNumbersOfDebtors } from './phone-numbers-of-debtor.entity';
import { ImagesOfDebtors } from './images-of-debtors.entity';

@Entity({ name: 'debtors' })
export class Debtor extends BaseModel {
  @Column()
  full_name: string;

  @Column()
  address: string;

  @Column()
  description: string;

  @ManyToOne(() => Store, (store) => store.debtors, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  store: Store;

  @OneToMany(() => Debt, (debt) => debt.debtor)
  debts: Debt[];

  @OneToMany(() => Messages, (messages) => messages.debtor)
  messages: Messages[];

  @OneToOne(() => Likes, (likes) => likes.debtor)
  like: Likes;

  @OneToMany(() => PhoneNumbersOfDebtors, (phone) => phone.debtor)
  phone_numbers: PhoneNumbersOfDebtors[];

  @OneToMany(() => ImagesOfDebtors, (images) => images.debtor)
  images: ImagesOfDebtors[];
}
