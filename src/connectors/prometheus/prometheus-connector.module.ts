import { PrometheusConnectorService } from './prometheus-connector.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrometheusConnectorService],
  exports: [PrometheusConnectorService]
})
export class PrometheusConnectorModule {}
