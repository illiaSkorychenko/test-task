import { ConfigObject } from '@nestjs/config/dist/types';
import { registerAs } from '@nestjs/config/dist/utils/register-as.util';
import { ZodSchema } from 'zod';

export function createConfigNamespace<T extends ConfigObject>(
  name: string,
  configData: Record<string, string | undefined>,
  validationSchema: ZodSchema<T>
) {
  return registerAs(name, (): T => {
    return validationSchema.parse(configData);
  });
}
