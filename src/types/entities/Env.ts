import { z } from 'zod';
import { EnvTypes } from '../enums/common/EnvTypes';

export const EnvSchema = z.object({
  NODE_ENV: z.nativeEnum(EnvTypes),
  HOST: z.string(),
  PORT: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  PREFIX: z.string(),
  AWS_REGION: z.string(),
  SQS_NOTIFICATION_QUEUE_URL: z.string(),
  SQS_VISIBILITY_TIMEOUT: z.string(),
  SQS_CUSTOM_ENDPOINT: z.string().optional(),
  PROMETHEUS_PRODUCT_COUNTER_NAME: z.string()
});

export type Env = z.infer<typeof EnvSchema>;
