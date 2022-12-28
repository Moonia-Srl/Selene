import { Body, Controller, Get, Query } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { AppService } from './app.service';

@Controller('/')
@ApiTags('Default')
export class AppController {
  constructor(
    private readonly DB: TypeOrmHealthIndicator,
    private readonly Service: AppService
  ) {}

  /*--------------------------------------------------------*/
  /*           Polls fresh NFT data from Rarible            */
  /*--------------------------------------------------------*/
  @Cron(CronExpression.EVERY_10_MINUTES)
  private CronScraper() {
    return this.Service.ScrapeFromRarible();
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
