import { Controller, Get, Param, Query } from '@nestjs/common';
import { RateService } from './rate.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('rates')
export class RatesController {
  constructor(private readonly rateService: RateService) {}

  @ApiResponse({ status: 200, description: 'Success' })
  @ApiOperation({
    summary: 'Gets rate by symbolA, symbolB',
    description: 'Required:all.',
  })
  @ApiTags('Rates')
  @Get('getRate')
  async getRate(
    @Query('symbolA') symbolA: string,
    @Query('symbolB') symbolB: string,
  ) {
    return this.rateService.getRate(symbolA, symbolB);
  }

  @ApiTags('Rates')
  @Get('getHistoryRates')
  async getHistoryRates(
    @Query('symbolA') symbolA: string,
    @Query('symbolB') symbolB: string,
    @Query('fromTimestamp') fromTimestamp: number,
    @Query('toTimestamp') toTimestamp: number,
  ) {
    return this.rateService.getHistoryRates(
      symbolA,
      symbolB,
      fromTimestamp,
      toTimestamp,
    );
  }
}
