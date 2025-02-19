import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { ConfigConnectorModule } from '../../../connectors/config/config-connector.module';
import { ProductsControllerModule } from '../../../controllers/product-controller/product-controller.module';
import { DbModule } from '../../../db/db.module';
import { MetricControllerModule } from '../../../controllers/metric-controller/metric-controller.module';

@Module({
  imports: [
    ConfigConnectorModule,
    DbModule.forRoot(),
    ProductsControllerModule,
    MetricControllerModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor
    }
  ]
})
export class HttpApiModule {}
