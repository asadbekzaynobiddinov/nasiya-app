import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { Store } from './store.entity';
import { BaseModel } from 'src/common/database';
import { Messages } from './message.entity';

@Entity({ name: 'sample_messages' })
export class SampleMessages extends BaseModel {
  @ManyToOne(() => Store, (store) => store.sample_messages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  store: Store;

  @Column({ nullable: false })
  sample: string;

  @OneToMany(() => Messages, (messages) => messages.sample_message)
  messages: Messages[];
}
