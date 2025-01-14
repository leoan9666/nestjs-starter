import { registerAs } from '@nestjs/config';

export const CLOUDWATCHLOG_CONFIG_NAME = 'cloudwatch-log';
export type CloudwatchLogConfig = {
  groupName: string;
  streamName: string;
};

export default registerAs(
  CLOUDWATCHLOG_CONFIG_NAME,
  () =>
    ({
      groupName: process.env.LOG_GROUP_NAME,
      streamName: process.env.LOG_STREAM_NAME,
    }) as CloudwatchLogConfig,
);
