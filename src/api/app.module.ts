import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from '../config/index';
import { DebtsModule } from './debts/debts.module';
import { StoreModule } from './store/store.module';
import { AuthModule } from './auth/auth.module';
import { DebtorModule } from './debtor/debtor.module';
import { AdminModule } from './admin/admin.module';
import { PaymentModule } from './payment/payment.module';
import { LikesModule } from './likes/likes.module';
import { SampleMessagesModule } from './sample_messages/sample_messages.module';
import { MessagesModule } from './messages/messages.module';
import { PhoneNumbersModule } from './phone_numbers/phone_numbers.module';
import { ImagesOfDebtsModule } from './images_of_debts/images_of_debts.module';
import { ImagesOfDebtorsModule } from './images_of_debtors/images_of_debtors.module';
import { UploadModule } from './upload/upload.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guard/jwt-auth.guard';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.DB_HOST,
      port: +config.DB_PORT,
      username: config.DB_USER,
      password: config.DB_PASS,
      database: config.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      entities: ['dist/core/entity/*.entity{.ts,.js}'],
    }),
    DebtsModule,
    StoreModule,
    AuthModule,
    DebtorModule,
    AdminModule,
    PaymentModule,
    LikesModule,
    SampleMessagesModule,
    MessagesModule,
    PhoneNumbersModule,
    ImagesOfDebtsModule,
    ImagesOfDebtorsModule,
    UploadModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
