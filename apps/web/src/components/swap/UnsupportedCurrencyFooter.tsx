import React, { useState } from "react";
import styled from "styled-components";
import { ChainId, Currency, Token } from "@rcpswap/sdk";

import { TYPE, CloseIcon, StyledInternalLink } from "@/theme";
import { ButtonEmpty } from "@/components/Button";
import Modal from "@/components/Modal";
import Card, { OutlineCard } from "@/components/Card";
import { RowBetween, AutoRow } from "@/components/Row";
import { AutoColumn } from "@/components/Column";
import CurrencyLogo from "@/components/CurrencyLogo";
import { getEtherscanLink } from "@/utils1";
import { wrappedCurrency } from "@/utils1/wrappedCurrency";
import { useUnsupportedTokens } from "@/hooks/Tokens";

const DetailsFooter = styled.div<{ show: boolean }>`
  padding-top: calc(16px + 2rem);
  padding-bottom: 20px;
  margin-top: -2rem;
  width: 100%;
  max-width: 400px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  color: ${({ theme }) => theme.text2};
  background-color: ${({ theme }) => theme.advancedBG};
  z-index: -1;

  transform: ${({ show }) => (show ? "translateY(0%)" : "translateY(-100%)")};
  transition: transform 300ms ease-in-out;
  text-align: center;
`;

const AddressText = styled(TYPE.blue)`
  font-size: 12px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 10px;
`}
`;

export default function UnsupportedCurrencyFooter({
  show,
  currencies,
  chainId,
}: {
  show: boolean;
  currencies: (Currency | undefined)[];
  chainId?: ChainId;
}) {
  const [showDetails, setShowDetails] = useState(false);

  const tokens =
    chainId && currencies
      ? currencies.map((currency) => {
          return wrappedCurrency(currency, chainId);
        })
      : [];

  const unsupportedTokens: { [address: string]: Token } =
    useUnsupportedTokens();

  return (
    <DetailsFooter show={show}>
      <Modal isOpen={showDetails} onDismiss={() => setShowDetails(false)}>
        <Card padding="2rem">
          <AutoColumn gap="lg">
            <RowBetween>
              <TYPE.mediumHeader>Unsupported Assets</TYPE.mediumHeader>

              <CloseIcon onClick={() => setShowDetails(false)} />
            </RowBetween>
            {tokens.map((token) => {
              return (
                token &&
                unsupportedTokens &&
                Object.keys(unsupportedTokens).includes(token.address) && (
                  <OutlineCard key={token.address?.concat("not-supported")}>
                    <AutoColumn gap="10px">
                      <AutoRow gap="5px" align="center">
                        <CurrencyLogo currency={token} size={"24px"} />
                        <TYPE.body fontWeight={500}>{token.symbol}</TYPE.body>
                      </AutoRow>
                      {chainId && (
                        <StyledInternalLink
                          href={getEtherscanLink(
                            chainId,
                            token.address,
                            "address"
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <AddressText>{token.address}</AddressText>
                        </StyledInternalLink>
                      )}
                    </AutoColumn>
                  </OutlineCard>
                )
              );
            })}
            <AutoColumn gap="lg">
              <TYPE.body fontWeight={500}>
                Some assets are not available through this interface because
                they may not work well with our smart contract or we are unable
                to allow trading for legal reasons.
              </TYPE.body>
            </AutoColumn>
          </AutoColumn>
        </Card>
      </Modal>
      <ButtonEmpty padding={"0"} onClick={() => setShowDetails(true)}>
        <TYPE.blue>Read more about unsupported assets</TYPE.blue>
      </ButtonEmpty>
    </DetailsFooter>
  );
}