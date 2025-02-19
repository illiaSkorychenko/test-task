import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { HttpApiModule } from './http-api.module';
import { ConfigConnectorService } from '../../../connectors/config/config-connector.service';
import { patchNestJsSwagger } from 'nestjs-zod';
import { CommonExceptionFilter } from '../common/exceptions-filters/common.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(HttpApiModule);
  const config = app.get<ConfigConnectorService>(ConfigConnectorService);
  const envConfig = config.getEnvConfig();
  app.setGlobalPrefix(envConfig.PREFIX);
  app.useGlobalFilters(new CommonExceptionFilter());
  app.enableShutdownHooks();

  patchNestJsSwagger();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(envConfig.PORT, envConfig.HOST);
}

bootstrap();
