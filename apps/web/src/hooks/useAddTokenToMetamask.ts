import { getTokenLogoURL } from './../components/CurrencyLogo/index'
import { wrappedCurrency } from '@/utils1/wrappedCurrency'
import { ChainId, Currency, Token } from '@rcpswap/sdk'
import { useCallback, useState } from 'react'
import { useWalletClient } from 'wagmi'

export default function useAddTokenToMetamask(
  currencyToAdd: Currency | undefined,
  chainId: ChainId
): { addToken: () => void; success: boolean | undefined } {
  const { data: walletClient } = useWalletClient()

  const token: Token | undefined = wrappedCurrency(currencyToAdd, chainId)

  const [success, setSuccess] = useState<boolean | undefined>()

  const addToken = useCallback(() => {
    if (walletClient && token) {
      walletClient.watchAsset({
        type: "ERC20",
        options: {
          address: token.address,
          symbol: token.symbol ?? '',
          decimals: token.decimals,
          image: getTokenLogoURL(chainId, token.address)
        }
      })
        .then(success => {
          setSuccess(success)
        })
        .catch(() => setSuccess(false))
    } else {
      setSuccess(false)
    }
  }, [walletClient, token])

  return { addToken, success }
}
