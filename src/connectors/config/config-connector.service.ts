import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { configEnvNamespace } from 'src/connectors/config/config-namespaces/env.config-namespace';
import { Env } from '../../types/entities/Env';

@Injectable()
export class ConfigConnectorService {
  constructor(
    @Inject(configEnvNamespace.KEY)
    private envConfig: ConfigType<typeof configEnvNamespace>
  ) {}

  getEnvConfig(): Env {
    return this.envConfig;
  }
}
