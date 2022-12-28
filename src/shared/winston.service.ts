import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModuleOptions } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class WinstonConfigService {
  @Inject(ConfigService) private readonly config: ConfigService;

  public createWinstonModuleOptions(): WinstonModuleOptions {
    return {
      transports: [
        // Rotates the debug logs, deleting the older ones every 20 days
        new transports.DailyRotateFile({
          level: 'debug',
          filename: `./logs/${this.config.get('NODE_ENV')}/debug-%DATE%.log`,
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(format.timestamp(), format.json()),
        }),

        // Rotates the debug logs, deleting the older ones every 30 days
        new transports.DailyRotateFile({
          level: 'error',
          filename: `./logs/${this.config.get('NODE_ENV')}/error-%DATE%.log`,
          zippedArchive: false,
          maxSize: '20m',
          maxFiles: '30d',
          format: format.combine(format.timestamp(), format.json()),
        }),

        new transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
            format.simple()
          ),
        }),
      ],
      exitOnError: false,
    };
  }
}
