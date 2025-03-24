import { Entity, ManyToOne, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';
import { Debt } from './debt.entity';

@Entity({ name: 'images_of_debts' })
export class ImagesOfDebts extends BaseModel {
  @Column()
  image: string;

  @ManyToOne(() => Debt, (debt) => debt.images, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  debt: Debt;
}
