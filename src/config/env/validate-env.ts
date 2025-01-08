import { ALLOWED_ENVIRONMENT_VARIABLES } from '@src/config/env/allowed-env-vars';
import { AppSchema } from '@src/config/env/app/app.validation';
import { AwsSchema } from '@src/config/env/aws/aws.validation';
import { CloudwatchLogSchema } from '@src/config/env/cloudwatch-log/cloudwatch-log.validation';
import { UpstashSchema } from '@src/config/env/upstash/upstash.validation';

import { z } from 'zod';

export default (environmentVariables: Record<string, any>) => {
  const filteredEnvironmentVariables = Object.fromEntries(
    Object.entries(environmentVariables).filter(([key]) =>
      ALLOWED_ENVIRONMENT_VARIABLES.includes(key),
    ),
  );

  const CombinedSchema = AppSchema.merge(AwsSchema)
    .merge(CloudwatchLogSchema)
    .merge(UpstashSchema);

  type CombinedConfig = z.infer<typeof CombinedSchema>;

  // This will validate and parse the config
  const parsedConfig: CombinedConfig = CombinedSchema.parse(
    filteredEnvironmentVariables,
  );

  return parsedConfig;
};
