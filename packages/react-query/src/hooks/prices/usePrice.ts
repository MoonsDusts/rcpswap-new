import { useQuery } from '@tanstack/react-query'
import { Fraction, ZERO } from 'rcpswap/math'
import { parseUnits } from 'viem'
import { ChainId } from 'rcpswap/chain'

const COINGECKO_TERMINAL_CHAIN_ID: { [chainId in ChainId]: string } = {
  [ChainId.ARBITRUM_NOVA]: 'arbitrum_nova',
  [ChainId.POLYGON]: 'polygon_pos'
}

interface UsePrice {
  chainId: ChainId | undefined
  address: string | undefined
}

export const usePrice = ({ chainId, address }: UsePrice) => {
  return useQuery({
    queryKey: [chainId && `https://api.geckoterminal.com/api/v2/networks/${COINGECKO_TERMINAL_CHAIN_ID[chainId]}/tokens/${address}`],
    queryFn: async () => {
      if (!chainId) return ZERO
      const data = await fetch(
        `https://api.geckoterminal.com/api/v2/networks/${COINGECKO_TERMINAL_CHAIN_ID[chainId]}/tokens/${address}`,
      ).then((response) => response.json())
      return new Fraction(
        parseUnits(parseFloat(data?.data?.attributes?.price_usd ?? '0').toFixed(18), 18).toString(),
        parseUnits('1', 18).toString(),
      )
    },
    enabled: Boolean(chainId && address),
    staleTime: 900000, // 15 mins
    cacheTime: 3600000, // 1hr
    refetchOnWindowFocus: false,
  })
}
