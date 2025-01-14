import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EnvironmentVariablesDto } from '../dto/validation/environment-variables.dto';

export function validateEnvironment(env: NodeJS.ProcessEnv): void {
  const validatedConfig = plainToInstance(EnvironmentVariablesDto, env, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((err) => Object.values(err.constraints || {}).join(', '))
      .join('; ');

    throw new Error(`Environment validation failed: ${errorMessages}`);
  }
}
