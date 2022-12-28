import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { WinstonModule } from 'nest-winston';
import { ApiModule } from './api/api.module';
import { Contract } from './api/contract/contract.entity';
import { NFT } from './api/nft/nft.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm.service';
import { WinstonConfigService } from './shared/winston.service';

const envFilePath: string = getEnvPath(`${__dirname}/../../environment`);

@Module({
  imports: [
    // Loads the .env file as configuration
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    // Loads the TypeORM configuration from a service
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    // Loads the custom logger with log rotation and compression
    WinstonModule.forRootAsync({ useClass: WinstonConfigService }),
    // Loads the internal job scheduler to program recurrent jobs (e.g. scraping Rarible)
    ScheduleModule.forRoot(),
    // Loads the morgan module to log incoming http requests
    MorganModule,
    // Loads the terminus module to retrieve health check results
    TerminusModule,

    // Loads the needed entities to be used in the cron scraper
    TypeOrmModule.forFeature([Contract, NFT]),

    // At last, load the whole api module with the api routes
    ApiModule,
  ],

  // MorganModule is registered as global interceptor
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev', { stream: { write: console.log } }),
    },
  ],

  controllers: [AppController],
})
export class AppModule {}
