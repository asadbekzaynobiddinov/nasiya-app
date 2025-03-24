import { Repository } from 'typeorm';
import { Messages } from '../entity/index';

export type MessagesRepository = Repository<Messages>;
