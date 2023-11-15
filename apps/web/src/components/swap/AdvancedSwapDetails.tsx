import { Blockchain, Trade, TradeType } from "@rcpswap/sdk";
import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { Field } from "../../state/swap/actions";
import { useUserSlippageTolerance } from "../../state/user/hooks";
import { TYPE, StyledInternalLink } from "../../theme";
import {
  computeSlippageAdjustedAmounts,
  computeTradePriceBreakdown,
} from "../../utils1/prices";
import { AutoColumn } from "../Column";
import QuestionHelper from "../QuestionHelper";
import { RowBetween, RowFixed } from "../Row";
import FormattedPriceImpact from "./FormattedPriceImpact";
import SwapRoute from "./SwapRoute";
import useBlockchain from "../../hooks/useBlockchain";
import getBlockchainAdjustedCurrency from "../../utils1/getBlockchainAdjustedCurrency";

const InfoLink = styled(StyledInternalLink)`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.bg3};
  padding: 6px 6px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text1};
`;

function TradeSummary({
  trade,
  allowedSlippage,
}: {
  trade: Trade;
  allowedSlippage: number;
}) {
  const blockchain = useBlockchain();

  const theme = useContext(ThemeContext);
  const { priceImpactWithoutFee, realizedLPFee } =
    computeTradePriceBreakdown(trade);
  const isExactIn = trade.tradeType === TradeType.EXACT_INPUT;
  const slippageAdjustedAmounts = computeSlippageAdjustedAmounts(
    trade,
    allowedSlippage
  );

  const tradeInputCurrency = getBlockchainAdjustedCurrency(
    blockchain,
    trade.inputAmount.currency
  );
  const tradeOutputCurrency = getBlockchainAdjustedCurrency(
    blockchain,
    trade.outputAmount.currency
  );

  return (
    <>
      <AutoColumn style={{ padding: "0 16px" }}>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme?.text2}>
              {isExactIn ? "Minimum received" : "Maximum sold"}
            </TYPE.black>
            <QuestionHelper text="Your transaction will revert if there is a large, unfavorable price movement before it is confirmed." />
          </RowFixed>
          <RowFixed>
            <TYPE.black color={theme?.text1} fontSize={14}>
              {isExactIn
                ? `${slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4)} ${
                    tradeOutputCurrency?.symbol
                  }` ?? "-"
                : `${slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4)} ${
                    tradeInputCurrency?.symbol
                  }` ?? "-"}
            </TYPE.black>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme?.text2}>
              Price Impact
            </TYPE.black>
            <QuestionHelper text="The difference between the market price and estimated price due to trade size." />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <TYPE.black fontSize={14} fontWeight={400} color={theme?.text2}>
              Liquidity Provider Fee
            </TYPE.black>
            <QuestionHelper
              text={`A portion of each trade (0.25%) goes to liquidity providers and 0.05% for RCPswap Treasury.`}
            />
          </RowFixed>
          <TYPE.black fontSize={14} color={theme?.text1}>
            {realizedLPFee
              ? `${realizedLPFee.toSignificant(4)} ${
                  tradeInputCurrency?.symbol
                }`
              : "-"}
          </TYPE.black>
        </RowBetween>
      </AutoColumn>
    </>
  );
}

export interface AdvancedSwapDetailsProps {
  trade?: Trade;
}

export function AdvancedSwapDetails({ trade }: AdvancedSwapDetailsProps) {
  const theme = useContext(ThemeContext);

  const [allowedSlippage] = useUserSlippageTolerance();

  const showRoute = Boolean(trade && trade.route.path.length > 2);

  const blockchain = useBlockchain();

  return (
    <AutoColumn gap="0px">
      {trade && (
        <>
          <TradeSummary trade={trade} allowedSlippage={allowedSlippage} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: "0 16px" }}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <TYPE.black
                    fontSize={14}
                    fontWeight={400}
                    color={theme?.text2}
                  >
                    Route
                  </TYPE.black>
                  <QuestionHelper text="Routing through these tokens resulted in the best price for your trade." />
                </span>
                <SwapRoute trade={trade} />
              </RowBetween>
            </>
          )}
          {blockchain === Blockchain.ETHEREUM && !showRoute && (
            <AutoColumn style={{ padding: "12px 16px 0 16px" }}>
              <InfoLink
                href={
                  "https://uniswap.info/pair/" +
                  trade.route.pairs[0].liquidityToken.address
                }
                target="_blank"
                rel="noreferrer"
              >
                View pair analytics ↗
              </InfoLink>
            </AutoColumn>
          )}
        </>
      )}
    </AutoColumn>
  );
}
