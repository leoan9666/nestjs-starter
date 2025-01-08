import { registerAs } from '@nestjs/config';

export const UPSTASH_CONFIG_NAME = 'upstash';
export type UpstashConfig = {
  connectionUri: string;
};

export default registerAs(
  UPSTASH_CONFIG_NAME,
  () =>
    ({
      connectionUri: process.env.UPSTASH_CONNECTION_URI,
    }) as UpstashConfig,
);
