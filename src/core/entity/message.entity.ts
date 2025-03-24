import { Entity, Column, ManyToOne } from 'typeorm';
import { Store } from './store.entity';
import { SampleMessages } from './sample.message.entity';
import { BaseModel } from 'src/common/database';
import { Debtor } from './debtor.entity';
import { MessageStatus } from 'src/common/enum';

@Entity({ name: 'messages' })
export class Messages extends BaseModel {
  @Column({ nullable: false })
  message: string;

  @Column({ type: 'enum', enum: MessageStatus, default: MessageStatus.PENDING })
  status: MessageStatus;

  @ManyToOne(() => Store, (store) => store.messages, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  store: Store;

  @ManyToOne(() => SampleMessages, (sample) => sample.messages)
  sample_message: SampleMessages;

  @ManyToOne(() => Debtor, (debtor) => debtor.messages)
  debtor: Debtor;
}
