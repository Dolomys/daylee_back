import { exit } from '@nestjs/cli/actions';
import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { object } from 'dot-object';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';
import { ValidateN } from '../decorator/validate-nested.decorator';

const YAML_CONFIG_FILENAME = 'config.yaml';

export class MongoDBEnvConfig {
  @IsString()
  URL: string;
}

export class CloudinaryEnvConfig {
  @IsString()
  NAME: string;

  @IsString()
  KEY: string;

  @IsString()
  SECRET: string;
}

export class JwtEnvConfig {
  @IsString()
  SECRET: string;

  @IsString()
  EXPIRATION_TIME: string;
}


export class EnvironmentVariables {
  @IsNumber()
  PORT: number = 3000;

  @ValidateN(MongoDBEnvConfig)
  MONGODB: MongoDBEnvConfig;

  @ValidateN(CloudinaryEnvConfig)
  CLOUDINARY: CloudinaryEnvConfig;

  @ValidateN(JwtEnvConfig)
  JWT: JwtEnvConfig;
}

export function validateEnv(config: Record<string, unknown>) {
  const yamlConfig =
    fileExistsSync(YAML_CONFIG_FILENAME) &&
    (yaml.load(readFileSync(YAML_CONFIG_FILENAME, 'utf8')) as Record<string, unknown>);

  const validatedConfig = plainToInstance(EnvironmentVariables, object({ ...config, ...yamlConfig }), {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false, whitelist: true });

  if (errors.length) {
    new Logger(validateEnv.name).error(errors.toString());
    exit();
  }

  return validatedConfig;
}
