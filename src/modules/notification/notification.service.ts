import { Injectable } from '@nestjs/common';
import { NotificationMessageDto } from '../../types/dtos/notification/NotificationMessageDto';
import { Logger } from '../../types/interfaces/connectors/Loggger';

@Injectable()
export class NotificationService {
  constructor(private logger: Logger) {}

  async processMessage(message: NotificationMessageDto) {
    this.logger.log('Message:', message);
    // TODO prometheus call
  }
}
