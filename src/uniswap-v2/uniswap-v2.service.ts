import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import BigNumber from 'bignumber.js';

const PANCAKE_FACTORY_ADDRESS = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';
const PANCAKE_FACTORY_ABI = [
  'function getPair(address tokenA, address tokenB) external view returns (address pair)',
];
const UNISWAP_ABI = [
  'function getReserves() public view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)',
  'function token0() public view returns (address)',
  'function token1() public view returns (address)',
];

@Injectable()
export class UniswapV2Service {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(
      'https://bsc-mainnet.infura.io/v3/7d2ded5d764947c1b90118c6b20f14ef',
    );
  }
  async getTokenAddress(symbol: string): Promise<string> {
    const tokenAddresses = {
      BNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', // Wrapped BNB (WBNB)
      BTC: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', // BTCB (Bitcoin BEP-20)
      ETH: '0x2170ed0880ac9a755fd29b2688956bd959f933f8', // Wrapped ETH (WETH)
      USDT: '0x55d398326f99059ff775485246999027b3197955', // Tether (USDT)
      BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56', // Binance USD (BUSD)
      USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', // USD Coin (USDC)
      DOGE: '0xba2ae424d960c26247dd6c32edc70b295c744c43', // Dogecoin (DOGE)
      ADA: '0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47', // Cardano (ADA)
      XRP: '0x1d2f0da169ceb9fc7e9c71a97c338b0ceaaefc41', // Ripple (XRP)
      DOT: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402', // Polkadot (DOT)
      SOL: '0x570a5d26f7765ecb712c0924e4de545b89fd43df', // Solana (SOL)
      AVAX: '0x1d1fa2fbe41f4205ee4bdb1fa847feefc724d8b3', // Avalanche (AVAX)
      MATIC: '0xcc42724c6683b7e57334c4e856f4c9965ed682bd', // Polygon (MATIC)
      GALA: '0x7ddee176f665cd201f93eede625770e2fd911990', // Gala (GALA)
      TON: '0x76a797a59ba2c17726896976b7b3747bfd1d220f', // Toncoin (TON)
    };

    const address = tokenAddresses[symbol];
    if (!address) {
      throw new Error(`Token address for symbol ${symbol} not found`);
    }

    return address;
  }

  async getPairAddress(symbolA: string, symbolB: string): Promise<string> {
    try {
      const tokenA = await this.getTokenAddress(symbolA);
      const tokenB = await this.getTokenAddress(symbolB);

      const factoryContract = new ethers.Contract(
        PANCAKE_FACTORY_ADDRESS,
        PANCAKE_FACTORY_ABI,
        this.provider,
      );

      const pairAddress = await factoryContract.getPair(tokenA, tokenB);
      const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

      if (pairAddress === ADDRESS_ZERO) return '';

      return pairAddress;
    } catch (err) {
      return '';
    }
  }

  async getPairReserves(pairAddress: string): Promise<[bigint, bigint] | any> {
    try {
      const contract = new ethers.Contract(
        pairAddress,
        UNISWAP_ABI,
        this.provider,
      );
      const [reserve0, reserve1] = await contract.getReserves();
      return [reserve0, reserve1];
    } catch (err) {
      return [0, 0];
    }
  }

  async calculateRate(reserve0: bigint, reserve1: bigint): Promise<any> {
    try {
      const bigNum1 = new BigNumber(reserve0.toString());
      const bigNum2 = new BigNumber(reserve1.toString());

      const result = bigNum2.dividedBy(bigNum1);

      const formatedPrice = new BigNumber(result);

      return formatedPrice.toFixed(10);
    } catch (err) {
      console.log(err);
      return 0;
    }
  }
}
