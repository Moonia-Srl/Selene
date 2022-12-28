import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';
import { DataSource } from 'typeorm';

function getEnvPath(envPath: string): string {
  // Get the current execution mode from shell environment
  const env = process.env.NODE_ENV;
  // Get the full path to the correct environment (production. staging,  development)
  const filePath = resolve(`${envPath}/${env ? `${env}.env` : 'development.env'}`);

  // If the environment file doesn't exist then an error is thrown
  if (!existsSync(filePath)) throw new Error(`${filePath} file not found`);
  return filePath;
}

// Loads the environment from the given path
config({ path: getEnvPath('./environment') });

// Exports the TypeORM configuration
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),

  database: process.env.DATABASE_NAME,

  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,

  migrationsRun: true,
  migrationsTableName: 'typeorm_migrations',

  logging: process.env.NODE_ENV !== 'production',

  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['./migrations/*.{ts,js}'],
});

AppDataSource.initialize().then(console.log).catch(console.log);
