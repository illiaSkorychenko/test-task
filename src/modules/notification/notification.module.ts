import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { PrometheusConnectorModule } from 'src/connectors/prometheus/prometheus-connector.module';
import { PrometheusConnectorService } from 'src/connectors/prometheus/prometheus-connector.service';

@Module({
  imports: [PrometheusConnectorModule],
  providers: [
    {
      provide: NotificationService.name,
      useFactory: (prometheusConnectorService: PrometheusConnectorService) =>
        new NotificationService(prometheusConnectorService),
      inject: [PrometheusConnectorService],
    },
  ],
  exports: [NotificationService.name],
})
export class NotificationModule {}
