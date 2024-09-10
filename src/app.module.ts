import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from '@nestjs-modules/ioredis';
import { BinanceModule } from './binance/binance.module';
import { UniswapV2Module } from './uniswap-v2/uniswap-v2.module';
import { CasheModule } from './cashe/cashe.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RateModule } from './rate/rate.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.INIT_MONGODB_URL || '', {
      dbName: 'crypto',
    }),
    RedisModule.forRoot({
      type: 'single',
      url: process.env.INIT_REDIS_DB_URL || '',
    }),
    ScheduleModule.forRoot(),
    BinanceModule,
    UniswapV2Module,
    CasheModule,
    RateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
