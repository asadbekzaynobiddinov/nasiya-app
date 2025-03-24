import { Column, Entity, ManyToOne } from 'typeorm';
import { Debtor } from './debtor.entity';
import { BaseModel } from 'src/common/database';

@Entity()
export class ImagesOfDebtors extends BaseModel {
  @Column()
  image: string;

  @ManyToOne(() => Debtor, (debtor) => debtor.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  debtor: Debtor;
}
