import { Module } from '@nestjs/common';
import { ConfigConnectorModule } from '../../../connectors/config/config-connector.module';
import { NotificationModule } from '../../../modules/notification/notification.module';
import { NotificationConsumerService } from './notification-consumer.srvice';
import { AwsConnectorModule } from '../../../connectors/aws/aws-connector.module';

@Module({
  imports: [ConfigConnectorModule, AwsConnectorModule, NotificationModule],
  providers: [NotificationConsumerService]
})
export class NotificationConsumerModule {}
