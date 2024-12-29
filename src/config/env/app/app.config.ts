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

export default registerAs(
  APP_CONFIG_NAME,
  () =>
    ({
      env: process.env.ENV || 'local',
      port: parseInt(process.env.PORT!, 10) || 8000,
      origin: process.env.ORIGIN,
    }) as AppConfig,
);
