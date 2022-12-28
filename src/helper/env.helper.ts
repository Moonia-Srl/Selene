import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(envPath: string): string {
  // Get the current execution mode from shell environment
  const env = process.env.NODE_ENV;
  // Get the full path to the correct environment (production. staging,  development)
  const filePath = resolve(`${envPath}/${env ? `${env}.env` : 'development.env'}`);

  // If the environment file doesn't exist then an error is thrown
  if (!existsSync(filePath)) throw new Error(`${filePath} file not found`);
  return filePath;
}
