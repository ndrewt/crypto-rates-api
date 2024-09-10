import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class BinanceService {
  async getRate(symbolA: string, symbolB: string): Promise<number> {
    try {
      const { data } = await axios.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=${symbolA}${symbolB}`,
      );
      return data.price;
    } catch (err) {
      //   console.error(err);
      return 0;
    }
  }
}
