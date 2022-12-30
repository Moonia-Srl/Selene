import { Body, Controller, Delete, Get, Inject, Logger, Query } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { AppService } from './app.service';

@Controller('/')
@ApiTags('Default')
export class AppController {
  constructor(
    private readonly Service: AppService,
    private readonly DB: TypeOrmHealthIndicator,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) { }

  @ApiOperation({ summary: 'Refresh the data from Rarible without waiting' })
  @ApiOkResponse({ description: 'Data refreshed correctly without any error' })
  /*--------------------------------------------------------*/
  /*           Polls fresh NFT data from Rarible            */
  /*--------------------------------------------------------*/
  @Cron(CronExpression.EVERY_30_MINUTES) @Delete('cache')
  private async CronScraper() {
    this.logger.debug("Started scraping process from Rarible", null)
    try { await this.Service.ScrapeFromRarible(); } 
    catch (err) { this.logger.error("Scraping process failed", err) }
    this.logger.debug("Finished scraping process from Rarible")
  }

  @ApiOperation({ summary: 'Returns whatever payload is provided (body or query)' })
  @ApiOkResponse({ description: 'The same data provided but returned in the body' })
  /*--------------------------------------------------------*/
  /*  Returns whatever payload is provided (body or query)  */
  /*--------------------------------------------------------*/
  @Get('mirror')
  public Mirror(@Query() query: unknown, @Body() body: unknown): Record<string, unknown> {
    return { query, body };
  }

  @ApiOperation({ summary: 'Returns insight about the database health' })
  @HealthCheck()
  /*-------------------------------------------------------*/
  /*        Returns insight about the database health      */
  /*-------------------------------------------------------*/
  @Get('health-check')
  public HealthCheck(): Promise<HealthIndicatorResult> {
    return this.DB.pingCheck('database');
  }
}
