import { NestFactory } from '@nestjs/core';
import { NotificationConsumerModule } from './notification-consumer.moduel';
import { NotificationConsumerService } from './notification-consumer.srvice';

async function bootstrap() {
  const app = await NestFactory.create(NotificationConsumerModule);
  const notificationConsumerService = app.get(NotificationConsumerService);

  await notificationConsumerService.run();
}

bootstrap();
