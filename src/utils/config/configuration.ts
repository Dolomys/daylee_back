import { exit } from '@nestjs/cli/actions';
import { Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';
import { object } from 'dot-object';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';

const YAML_CONFIG_FILENAME = 'config.yaml';

export class MongoDBEnvConfig {
  @IsString()
  URL: string;
}

export class CloudinaryEnvConfig {

}

export class JwtEnvConfig {

}


export class EnvironmentVariables {
  @IsNumber()
  PORT: number = 3000;

  @IsString()
  MONGODB_URL: string;

  @IsString()
  CLOUDINARY_NAME: string;

  @IsString()
  CLOUDINARY_KEY: string;

  @IsString()
  CLOUDINARY_SECRET: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_EXPIRATION_TIME: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const yamlConfig =
    fileExistsSync(YAML_CONFIG_FILENAME) &&
    (yaml.load(readFileSync(YAML_CONFIG_FILENAME, 'utf8')) as Record<string, unknown>);

    console.log(yamlConfig)
  const validatedConfig = plainToInstance(EnvironmentVariables, object({ ...config, ...yamlConfig,...process.env }), {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, { skipMissingProperties: false, whitelist: true });

  if (errors.length) {
    new Logger(validateEnv.name).error(errors.toString());
    exit();
  }

  return validatedConfig;
}
