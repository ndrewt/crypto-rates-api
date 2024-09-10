import { Injectable } from '@nestjs/common';
import BigNumber from 'bignumber.js';
import { RateInterface } from './rate.model';
import { Model } from 'mongoose';
import { UniswapV2Service } from 'src/uniswap-v2/uniswap-v2.service';
import { CasheService } from 'src/cashe/cashe.service';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BinanceService } from 'src/binance/binance.service';
import { WhiteListInterface } from './whitelist.model';

@Injectable()
export class RateService {
  constructor(
    @InjectModel('rate') private readonly rateModel: Model<RateInterface>,
    @InjectModel('whitelists')
    private readonly whiteListModel: Model<WhiteListInterface>,
    private readonly uniService: UniswapV2Service,
    private readonly casheService: CasheService,
    private readonly binanceService: BinanceService,
  ) {}

  async getRate(symbolA: string, symbolB: string) {
    symbolA = symbolA.toUpperCase();
    symbolB = symbolB.toUpperCase();

    const rate = await this.casheService.getCachedRate(symbolA, symbolB);
    const rateLength = Object.keys(rate).length;
    return {
      rate: rateLength > 1 ? Number(rate['rate']) : 0,
      timestamp: rateLength > 0 ? Number(rate['timestamp']) : 0,
    };
  }

  async getHistoryRates(
    symbolA: string,
    symbolB: string,
    fromTimestamp: number,
    toTimestamp: number,
  ) {
    symbolA = symbolA.toUpperCase();
    symbolB = symbolB.toUpperCase();
    fromTimestamp = Number(fromTimestamp);
    toTimestamp = Number(toTimestamp);

    const rate = await this.rateModel
      .find({
        symbolA,
        symbolB,
        timestamp: {
          $gt: fromTimestamp,
          $lt: toTimestamp,
        },
        isCorrect: true,
      })
      .select({ rate: 1, timestamp: 1, _id: 0 });

    return rate;
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    console.log(
      '==================Fetch Crypto Rate Cron started==================',
    );
    await this.prepareWhiteList();

    const pairs = await this.whiteListModel.find().exec();

    for (const { symbolA, symbolB } of pairs) {
      const timestamp = Math.floor(Date.now() / 1000);
      const rate = await this.binanceService.getRate(symbolA, symbolB);
      if (rate != 0) {
        console.log(`Rate for ${symbolA}/${symbolB}: ${rate}`);
        const uniPairAdress = await this.uniService.getPairAddress(
          symbolA,
          symbolB,
        );

        const pairReserves =
          await this.uniService.getPairReserves(uniPairAdress);

        const uniRate = await this.uniService.calculateRate(
          pairReserves[0],
          pairReserves[1],
        );

        const isCorrect = this.isDifferenceWithin10Percent(rate, uniRate);
        await this.rateModel.create({
          symbolA,
          symbolB,
          rate,
          binancePair: `${symbolA}${symbolB}`,
          pairAddressUni: uniPairAdress,
          isCorrect,
          timestamp: timestamp,
        });

        await this.casheService.cacheRate(symbolA, symbolB, rate, timestamp);
      }
    }
    console.log(
      '==================Fetch Crypto Rate Cron ended==================',
    );
  }

  isDifferenceWithin10Percent(a: number, bStr: string) {
    const b = new BigNumber(bStr);

    const aBig = new BigNumber(a);
    const difference = aBig.minus(b).abs();
    const average = aBig.plus(b).dividedBy(2);

    if (average.isZero()) {
      return difference.isZero();
    }

    const percentageDifference = difference
      .dividedBy(average)
      .multipliedBy(100);

    return percentageDifference.isLessThan(10);
  }

  async prepareWhiteList() {
    const allCount = await this.whiteListModel.countDocuments();
    console.log(allCount);
    if (allCount == 0) {
      const DefaultPairs = [
        { symbolA: 'ETH', symbolB: 'BTC' },
        { symbolA: 'GALA', symbolB: 'BNB' },
        { symbolA: 'DOGE', symbolB: 'BNB' },
        { symbolA: 'BNB', symbolB: 'ETH' },
        { symbolA: 'TON', symbolB: 'USDT' },
      ];

      for (const { symbolA, symbolB } of DefaultPairs) {
        await this.whiteListModel.create({ symbolA, symbolB });
      }
    }
  }
}
