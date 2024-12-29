import { registerAs } from '@nestjs/config';

type Env = 'local' | 'development' | 'staging' | 'production';
export const EnvConstants = {
  LOCAL: 'local' as Env,
  DEVELOPMENT: 'development' as Env,
  STAGING: 'staging' as Env,
  PRODUCTION: 'production' as Env,
};

export const APP_CONFIG_NAME = 'app';
export type AppConfig = {
  env: Env;
  port: number;
  origin: string;
};

const appConfig: AppConfig = {
  env: process.env.ENV as Env,
  port: parseInt(process.env.PORT, 10),
  origin: process.env.ORIGIN,
};

export default registerAs(APP_CONFIG_NAME, () => appConfig);
