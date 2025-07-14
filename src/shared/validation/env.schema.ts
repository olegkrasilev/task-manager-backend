import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'prod', 'test']).default('dev'),
  PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val), { message: 'PORT must be a number' }),
  DB_HOST: z.string().nonempty(),
  DB_PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val), {
      message: 'DB_PORT must be a number',
    }),
  DB_USER: z.string().nonempty(),
  DB_PASSWORD: z.string().nonempty(),
  DB_NAME: z.string().nonempty(),
  REDIS_HOST: z.string().nonempty(),
  REDIS_PORT: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val), {
      message: 'REDIS_PORT must be a number',
    }),
});
