import { registerAs } from '@nestjs/config';
import { z } from 'zod';

import { envSchema } from '../validation/env.schema';

export type AppConfig = z.infer<typeof envSchema>;

export default registerAs('appConfig', (): AppConfig => {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid environment variables');
    throw new Error('Environment validation failed');
  }

  return parsed.data;
});
