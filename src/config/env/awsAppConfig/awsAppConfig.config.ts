import { registerAs } from '@nestjs/config';

export const AWS_APP_CONFIG_NAME = 'aws-app-config';
export type AwsAppConfig = {
  applicationID: string;
  environmentID: string;
};

export default registerAs(
  AWS_APP_CONFIG_NAME,
  () =>
    ({
      applicationID: process.env.APP_CONFIG_APPLICATION_ID,
      environmentID: process.env.APP_CONFIG_ENVIRONMENT_ID,
    }) as AwsAppConfig,
);
