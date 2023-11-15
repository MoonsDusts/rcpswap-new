import { ButtonConfirmed, ButtonError } from "@/components/Button";
import Checker from "@/components/Checker";
import Loader from "@/components/Loader";
import { AutoRow, RowBetween } from "@/components/Row";
import { useDerivedSwapState } from "@/state/swap/hooks";
import { ApprovalState } from "@rcpswap/wagmi";
import { ROUTE_PROCESSOR_3_ADDRESS } from "rcpswap/config";
import { tryParseAmount } from "rcpswap/currency";
import { useMemo } from "react";
import { Text } from "rebass";

export default function SwapTradeButton() {
  const {
    state: { chainId0, token0, swapAmount },
  } = useDerivedSwapState();

  const parsedAmount = useMemo(
    () => tryParseAmount(swapAmount, token0),
    [token0, swapAmount]
  );

  return (
    <Checker.Connect>
      <Checker.Network chainId={chainId0}>
        <Checker.Amounts chainId={chainId0} amounts={[parsedAmount]}>
          <Checker.ApproveERC20
            amount={parsedAmount}
            contract={ROUTE_PROCESSOR_3_ADDRESS[chainId0]}
          >
            {(approvalSubmitted, approvalState, approve) => (
              <RowBetween>
                <ButtonConfirmed
                  onClick={() => approve?.()}
                  disabled={
                    approvalState !== ApprovalState.NOT_APPROVED ||
                    approvalSubmitted
                  }
                  width="48%"
                  altDisabledStyle={approvalState === ApprovalState.PENDING}
                  confirmed={approvalState === ApprovalState.APPROVED}
                >
                  {approvalState === ApprovalState.PENDING ? (
                    <AutoRow gap="6px" justify="center">
                      Approving <Loader stroke="white" />
                    </AutoRow>
                  ) : approvalSubmitted &&
                    approvalState === ApprovalState.APPROVED ? (
                    "Approved"
                  ) : (
                    "Approve " + token0?.symbol
                  )}
                </ButtonConfirmed>
                <ButtonError
                  onClick={() => {}}
                  width="48%"
                  id="swap-button"
                  disabled={
                    !isValid ||
                    approvalState !== ApprovalState.APPROVED ||
                    (priceImpactSeverity > 3 && !isExpertMode && swapMode === 0)
                  }
                  error={isValid && priceImpactSeverity > 2}
                >
                  <Text fontSize={16} fontWeight={500}>
                    {priceImpactSeverity > 3 && !isExpertMode
                      ? `Price Impact High`
                      : `Swap${priceImpactSeverity > 2 ? " Anyway" : ""}`}
                  </Text>
                </ButtonError>
              </RowBetween>
            )}
          </Checker.ApproveERC20>
        </Checker.Amounts>
      </Checker.Network>
    </Checker.Connect>
  );
}
