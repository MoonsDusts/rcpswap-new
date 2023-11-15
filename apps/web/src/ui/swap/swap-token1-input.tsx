import CurrencyInputPanel from "@/components/CurrencyInputPanel";
import { useDerivedSwapState } from "@/state/swap/hooks";

export default function SwapToken1Input() {
  const {
    state: { token1, chainId1, token0, swapMode },
    mutate: { setToken1, setChainId1 },
  } = useDerivedSwapState();

  return (
    <CurrencyInputPanel
      value={""}
      onUserInput={() => {}}
      label={"To"}
      showMaxButton={false}
      currency={token1}
      onCurrencySelect={setToken1}
      hideChain={swapMode === 0}
      chainId={chainId1}
      onChainSelect={setChainId1}
      otherCurrency={token0}
      id="swap-currency-output"
      // disabled={swapMode === 1}
      // inPrice={outputTokenPrice}
      // outPrice={inputTokenPrice}
      showPriceImpact
      // loading={swapMode === 1 && fusionSwap.loading}
      // saving={fusionSaving}
    />
  );
}
