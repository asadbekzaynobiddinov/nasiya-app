import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleMessagesController } from './sample_messages.controller';
import { SampleMessagesService } from './sample_messages.service';
import { SampleMessages } from '../../core/entity/index';

@Module({
  imports: [TypeOrmModule.forFeature([SampleMessages])],
  controllers: [SampleMessagesController],
  providers: [SampleMessagesService],
})
export class SampleMessagesModule {}
