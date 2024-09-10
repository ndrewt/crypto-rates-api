import { Module } from '@nestjs/common';
import { UniswapV2Service } from './uniswap-v2.service';

@Module({
  providers: [UniswapV2Service],
  exports: [UniswapV2Service],
})
export class UniswapV2Module {}
