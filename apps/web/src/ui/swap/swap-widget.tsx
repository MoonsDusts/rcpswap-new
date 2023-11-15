import styled from "styled-components";
import SwapHeader from "./swap-header";
import { Wrapper } from "@/components/swap/styleds";
import { AutoColumn } from "@/components/Column";
import SwapToken0Input from "./swap-token0-input";
import SwapTokenSlideInput from "./swap-token-slide-input";
import SwapSwitchTokensButton from "./swap-switch-tokens-button";
import SwapToken1Input from "./swap-token1-input";
import SwapTradeButton from "./swap-trade-button";

export const BodyWrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 30px;
  /* padding: 1rem; */
`;

export default function SwapWidget() {
  return (
    <BodyWrapper>
      <SwapHeader />
      <Wrapper id="swap-widget">
        <AutoColumn gap="md">
          <SwapToken0Input />
          <SwapTokenSlideInput />
          <SwapSwitchTokensButton />
          <SwapToken1Input />
          <SwapTradeButton />
        </AutoColumn>
      </Wrapper>
    </BodyWrapper>
  );
}
