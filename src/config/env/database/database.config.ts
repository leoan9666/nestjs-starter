import { registerAs } from '@nestjs/config';

export const DATABASE_CONFIG_NAME = 'database';
export type DatabaseConfig = {
  url: string;
};

export default registerAs(
  DATABASE_CONFIG_NAME,
  () =>
    ({
      url: process.env.DATABASE_URL,
    }) as DatabaseConfig,
);
