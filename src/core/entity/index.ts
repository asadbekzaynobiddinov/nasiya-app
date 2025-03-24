export * from './admin.entity';
export * from './debtor.entity';
export * from './debt.entity';
export * from './store.entity';
export * from './images-of-debtors.entity';
export * from './images-of-debts.entity';
export * from './likes.entity';
export * from './message.entity';
export * from './payment.entity';
export * from './phone-numbers-of-debtor.entity';
export * from './sample.message.entity';

import { Admin } from './admin.entity';
import { Debtor } from './debtor.entity';
import { Debt } from './debt.entity';
import { Store } from './store.entity';
import { ImagesOfDebtors } from './images-of-debtors.entity';
import { ImagesOfDebts } from './images-of-debts.entity';
import { Likes } from './likes.entity';
import { Messages } from './message.entity';
import { Payments } from './payment.entity';
import { PhoneNumbersOfDebtors } from './phone-numbers-of-debtor.entity';
import { SampleMessages } from './sample.message.entity';

export const entities = [
  Admin,
  Debtor,
  Debt,
  Store,
  ImagesOfDebtors,
  ImagesOfDebts,
  Likes,
  Messages,
  Payments,
  PhoneNumbersOfDebtors,
  SampleMessages,
];
