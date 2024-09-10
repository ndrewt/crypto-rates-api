import { Module } from '@nestjs/common';
import { RatesController } from './rate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RateSchema } from './rate.model';
import { WhiteListSchema } from './whitelist.model';
import { RateService } from './rate.service';
import { UniswapV2Module } from 'src/uniswap-v2/uniswap-v2.module';
import { CasheModule } from 'src/cashe/cashe.module';
import { BinanceModule } from 'src/binance/binance.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'rate', schema: RateSchema },
      { name: 'whitelists', schema: WhiteListSchema },
    ]),
    UniswapV2Module,
    CasheModule,
    BinanceModule,
  ],
  controllers: [RatesController],
  exports: [MongooseModule],
  providers: [RateService],
})
export class RateModule {}
