import { Entity, Column } from 'typeorm';
import { BaseModel } from '../../common/database/index';
import { AdminRoles } from 'src/common/enum';

@Entity({ name: 'admins' })
export class Admin extends BaseModel {
  @Column({ unique: true })
  username: string;

  @Column()
  hashed_password: string;

  @Column()
  phone_number: string;

  @Column({
    type: 'enum',
    enum: AdminRoles,
    default: AdminRoles.ADMIN,
  })
  role: AdminRoles;
}

export { AdminRoles };
