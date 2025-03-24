import { Repository } from 'typeorm';
import { Payments } from '../entity/index';

export type PaymentRepository = Repository<Payments>;
