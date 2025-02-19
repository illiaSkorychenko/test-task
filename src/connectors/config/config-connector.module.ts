import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configEnvNamespace } from './config-namespaces/env.config-namespace';
import { ConfigConnectorService } from './config-connector.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configEnvNamespace],
      cache: true,
      isGlobal: true
    })
  ],
  providers: [ConfigConnectorService],
  exports: [ConfigConnectorService]
})
export class ConfigConnectorModule {}
