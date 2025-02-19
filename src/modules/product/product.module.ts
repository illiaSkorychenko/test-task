import { Module } from '@nestjs/common';
import { AwsConnectorModule } from '../../connectors/aws/aws-connector.module';
import { ProductService } from './product.service'; // was GoodsService
import { SqsConnectorService } from '../../connectors/aws/sqs-connector.service';
import { ReposModule } from '../../repos/repos.module';
import { ProductRepoService } from '../../repos/product-repo.service';
import { PrometheusConnectorModule } from '../../connectors/prometheus/prometheus-connector.module';
import { PrometheusConnectorService } from '../../connectors/prometheus/prometheus-connector.service';

@Module({
  imports: [AwsConnectorModule, ReposModule, PrometheusConnectorModule],
  providers: [
    {
      provide: ProductService.name,
      useFactory: (messageBroker, productRepo, prometheusConnector) =>
        new ProductService(messageBroker, productRepo, prometheusConnector),
      inject: [SqsConnectorService, ProductRepoService, PrometheusConnectorService]
    }
  ],
  exports: [ProductService.name]
})
export class ProductModule {}
