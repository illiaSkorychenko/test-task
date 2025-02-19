import { Injectable } from '@nestjs/common';
import promClient from 'prom-client';
import { ConfigConnectorService } from '../config/config-connector.service';
import { NotificationTypes } from '../../types/enums/common/NotificationTypes';

@Injectable()
export class PrometheusConnectorService {
  private requestCounter: promClient.Counter;

  constructor(private configConnector: ConfigConnectorService) {
    const envConfig = this.configConnector.getEnvConfig();

    this.requestCounter = new promClient.Counter({
      name: envConfig.PROMETHEUS_PRODUCT_COUNTER_NAME,
      help: 'Product request counter',
      labelNames: ['action_type']
    });
  }

  async incActionCounter(type: NotificationTypes) {
    this.requestCounter.labels(type).inc();
  }

  async getMetrics() {
    const metrics = await promClient.register.metrics();

    return {
      metrics,
      contentType: promClient.register.contentType
    };
  }
}
