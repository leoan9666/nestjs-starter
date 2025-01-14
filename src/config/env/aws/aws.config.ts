import { registerAs } from '@nestjs/config';

type AwsRegion = 'ap-southeast-1';

export const AWS_CONFIG_NAME = 'aws';
export type AwsConfig = {
  accessKey: string;
  secretKey: string;
  region: AwsRegion;
};

export default registerAs(
  AWS_CONFIG_NAME,
  () =>
    ({
      accessKey: process.env.AWS_ACCESS_KEY,
      secretKey: process.env.AWS_SECRET_KEY,
      region: process.env.AWS_REGION,
    }) as AwsConfig,
);
