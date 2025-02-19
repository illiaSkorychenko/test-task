import { MetricController } from './metric.controller';
import { PrometheusConnectorModule } from '../../connectors/prometheus/prometheus-connector.module';
import { Module } from '@nestjs/common';
import { PrometheusConnectorService } from '../../connectors/prometheus/prometheus-connector.service';
import { MetricServiceToken } from '../../types/tokens';

@Module({
  imports: [PrometheusConnectorModule],
  providers: [{
    provide: MetricServiceToken,
    useExisting: PrometheusConnectorService
  }],
  controllers: [MetricController]
})
export class MetricControllerModule {}
