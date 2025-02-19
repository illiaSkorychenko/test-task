import { Module } from '@nestjs/common';
import { SqsConnectorService } from 'src/connectors/aws/sqs-connector.service';

@Module({
  providers: [SqsConnectorService],
  exports: [SqsConnectorService]
})
export class AwsConnectorModule {}
