import { Inject, Injectable, Logger } from '@nestjs/common';
import { ApplicationException } from '../../../types/exceptions/ApplicationException';
import { SqsConnectorService } from '../../../connectors/aws/sqs-connector.service';
import { NotificationMessageDtoSchema } from '../../../types/dtos/notification/NotificationMessageDto';
import { NotificationService } from '../../../modules/notification/notification.service';
import { ConfigConnectorService } from '../../../connectors/config/config-connector.service';

@Injectable()
export class NotificationConsumerService {
  constructor(
    @Inject(NotificationService.name)
    private notificationService: NotificationService,
    private sqsConnector: SqsConnectorService,
    private configConnector: ConfigConnectorService
  ) {}

  async handleMessage() {
    const envConfig = this.configConnector.getEnvConfig();
    const message = await this.sqsConnector.receiveMessage(
      parseInt(envConfig.SQS_VISIBILITY_TIMEOUT),
      envConfig.SQS_NOTIFICATION_QUEUE_URL
    );

    if (!message) {
      return;
    }

    const { handler, body } = message;

    try {
      const data = NotificationMessageDtoSchema.parse(body);

      await this.notificationService.processMessage(data);

      await this.sqsConnector.deleteMessage(handler, envConfig.SQS_NOTIFICATION_QUEUE_URL);
    } catch (err) {
      await this.sqsConnector.deleteMessage(handler, envConfig.SQS_NOTIFICATION_QUEUE_URL);

      throw new ApplicationException('Error while processing message', err);
    }
  }

  async run() {
    Logger.log('Notification consumer started');

    while (true) {
      try {
        await this.handleMessage();
      } catch (err) {
        Logger.error(err);
      }
    }
  }
}
