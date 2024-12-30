import { registerAs } from '@nestjs/config';

export const AWS_CONFIG_NAME = 'aws';
export type AwsConfig = {
  accessKey: string;
  secretKey: string;
};

export default registerAs(
  AWS_CONFIG_NAME,
  () =>
    ({
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
    }) as AwsConfig,
);
