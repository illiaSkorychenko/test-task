import { BeforeApplicationShutdown, DynamicModule } from '@nestjs/common';
import { Client, ClientConfig } from 'pg';
import { ConfigConnectorService } from '../connectors/config/config-connector.service';
import { EnvTypes } from '../types/enums/common/EnvTypes';

export const DB_CONNECTION_TOKEN = 'DB_CONNECTION';

export class DbModule implements BeforeApplicationShutdown {
  private client?: Client;

  static forRoot(): DynamicModule {
    const module = new DbModule();

    return {
      module: DbModule,
      global: true,
      providers: [
        {
          inject: [ConfigConnectorService],
          provide: DB_CONNECTION_TOKEN,
          useFactory: async (configConnectorService: ConfigConnectorService) => {
            const envConfig = configConnectorService.getEnvConfig();
            const clientConfig: ClientConfig = {
              host: envConfig.DB_HOST,
              port: parseInt(envConfig.DB_PORT),
              database: envConfig.DB_NAME,
              user: envConfig.DB_USER,
              password: envConfig.DB_PASSWORD,
            };

            if (envConfig.NODE_ENV !== EnvTypes.Local) {
              clientConfig.ssl = true;
            }

            const client = new Client(clientConfig);
            await client.connect();
            module.client = client;

            return client;
          },
        },
      ],
      exports: [DB_CONNECTION_TOKEN],
    };
  }

  async beforeApplicationShutdown() {
    await this.client?.end();
  }
}
