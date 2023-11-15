"use client";

import StepSlider from "@/components/StepSlider";
import { useDerivedSwapState } from "@/state/swap/hooks";
import { useAccount, useBalanceWeb3 } from "@rcpswap/wagmi";
import { useCallback, useRef, useState } from "react";

export default function SwapTokenSlideInput() {
  const { address } = useAccount();

  const slideTimerRef = useRef<number | null>(null);
  // const [tempInputValue, setTempInputValue] = useState("0");
  // const [percentageSliding, setPercentageSliding] = useState(false);

  const {
    state: { token0, chainId0, swapSlidePercentage },
    mutate: { setSwapAmount, setSwapSlidePercentage },
  } = useDerivedSwapState();

  const { data: maxAmountInput } = useBalanceWeb3({
    account: address,
    currency: token0,
    chainId: chainId0,
  });

  // const onChange = useCallback(
  //   (step: number) => {
  //     setPercentageSlide(step);
  //     setPercentageSliding(true);

  //     if (slideTimerRef.current) {
  //       clearTimeout(slideTimerRef.current);
  //       slideTimerRef.current = null;
  //     }

  //     slideTimerRef.current = setTimeout(() => {
  //       if (maxAmountInput) {
  //         const particalAmount = maxAmountInput.multiply(step).divide(100);

  //         setTempInputValue(particalAmount.toExact());
  //       }
  //     }, 20) as unknown as number;
  //   },
  //   [maxAmountInput?.toExact(), setTempInputValue]
  // );

  const onChange = useCallback(
    (step: number) => {
      setSwapSlidePercentage(step);
      // setPercentageSliding(false);

      if (slideTimerRef.current) {
        clearTimeout(slideTimerRef.current);
        slideTimerRef.current = null;
      }

      if (maxAmountInput) {
        const particalAmount = maxAmountInput.multiply(step).divide(100);

        setSwapAmount(particalAmount.toExact());
      }
    },
    [maxAmountInput?.toExact(), setSwapAmount]
  );

  return (
    <StepSlider
      step={swapSlidePercentage}
      onChange={onChange}
      onAfterChange={() => {}}
      enabled={Boolean(maxAmountInput)}
    />
  );
}
