import { ChainId } from 'rcpswap/chain'
import { PublicClient } from 'viem'

import { LiquidityProviders } from './LiquidityProvider'
import { UniswapV2BaseProvider } from './UniswapV2Base'

export class SushiSwapV2Provider extends UniswapV2BaseProvider {
  constructor(chainId: ChainId, web3Client: PublicClient) {
    const factory = {
      [ChainId.ARBITRUM_NOVA]: '0xf6239423fcf1c19ed2791d9648a90836074242fd',
    } as const

    const initCodeHash = {
      [ChainId.ARBITRUM_NOVA]: '0x70b19cf85a176c6b86e2d324be179104bdc8fafee13d548ae07d28b9f53cbc71',
    } as const

    super(chainId, web3Client, factory, initCodeHash)
  }
  getType(): LiquidityProviders {
    return LiquidityProviders.SushiSwapV2
  }
  getPoolProviderName(): string {
    return 'SushiSwapV2'
  }
}
