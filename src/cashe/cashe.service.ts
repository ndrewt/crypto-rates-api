import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class CasheService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async cacheRate(
    symbolA: string,
    symbolB: string,
    rate: number,
    timestamp: number,
  ): Promise<void> {
    await this.redis.hset(`crypto_rate:${symbolA}_${symbolB}`, {
      rate,
      timestamp,
    });
  }

  async getCachedRate(symbolA: string, symbolB: string): Promise<Object> {
    const rate = await this.redis.hgetall(`crypto_rate:${symbolA}_${symbolB}`);
    return rate;
  }
}
