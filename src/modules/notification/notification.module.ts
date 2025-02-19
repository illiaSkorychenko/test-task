import { Logger, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Module({
  providers: [
    {
      provide: NotificationService.name,
      useFactory: () => new NotificationService(Logger),
      inject: []
    }
  ],
  exports: [NotificationService.name]
})
export class NotificationModule {}
