import { ALLOWED_ENVIRONMENT_VARIABLES } from '@src/config/env/allowed-env-vars';
import { AppSchema } from '@src/config/env/app/app.validation';
import { z } from 'zod';

export default (environmentVariables: Record<string, any>) => {
  const filteredEnvironmentVariables = Object.fromEntries(
    Object.entries(environmentVariables).filter(([key]) =>
      ALLOWED_ENVIRONMENT_VARIABLES.includes(key),
    ),
  );

  // TODO: add other config schemas
  // const CombinedSchema = AppSchema.merge(DatabaseSchema);
  const CombinedSchema = AppSchema;

  type CombinedConfig = z.infer<typeof CombinedSchema>;

  // This will validate and parse the config
  const parsedConfig: CombinedConfig = CombinedSchema.parse(
    filteredEnvironmentVariables,
  );

  return parsedConfig;
};
