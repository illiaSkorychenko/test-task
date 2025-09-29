import { NotificationMessageDto } from '../../types/dtos/notification/NotificationMessageDto';
import { MetricService } from 'src/types/interfaces/connectors/MetricService';

export class NotificationService {
  constructor(private messageService: MetricService) {}

  async processMessage(message: NotificationMessageDto) {
    await this.messageService.incActionCounter(message.type);
  }
}
