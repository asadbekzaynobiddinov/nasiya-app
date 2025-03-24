import { Entity, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { Debtor } from './debtor.entity';
import { Store } from './store.entity';
import { BaseModel } from 'src/common/database';

@Entity({ name: 'likes' })
export class Likes extends BaseModel {
  @ManyToOne(() => Store, (store) => store.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  store: Store;

  @OneToOne(() => Debtor, (debtor) => debtor.like, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'debtor_id' })
  debtor: Debtor;
}
