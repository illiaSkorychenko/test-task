import { Controller, Get, Inject, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricServiceToken } from '../../types/tokens';
import { MetricService } from '../../types/interfaces/connectors/MetricService';

@Controller('metrics')
export class MetricController {
  constructor(
    @Inject(MetricServiceToken)
    private readonly metricService: MetricService
  ) {}

  @Get('/')
  async getMetrics(@Res() resp: Response) {
    const { metrics, contentType } = await this.metricService.getMetrics();

    return resp.status(200).header('Content-Type', contentType).send(metrics);
  }
}
