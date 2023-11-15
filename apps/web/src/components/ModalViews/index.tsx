import React, { useContext } from "react";
import { useActiveWeb3React } from "../../hooks";

import { AutoColumn, ColumnCenter } from "../Column";
import styled, { ThemeContext } from "styled-components";
import { RowBetween } from "../Row";
import { TYPE, CloseIcon, CustomLightSpinner } from "../../theme";
import { FiArrowUpCircle } from "react-icons/fi";

import Circle from "../../assets/images/blue-loader.svg";
import { getEtherscanLink } from "../../utils1";
import { ExternalLink } from "../../theme/components";

import useBlockchain from "../../hooks/useBlockchain";
import getExplorerName from "../../utils1/getExplorerName";
import { ChainId } from "@rcpswap/sdk";

const ConfirmOrLoadingWrapper = styled.div`
  width: 100%;
  padding: 24px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

export function LoadingView({
  children,
  onDismiss,
}: {
  children: any;
  onDismiss: () => void;
}) {
  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <CustomLightSpinner src={Circle} alt="loader" size={"90px"} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={"center"}>
        {children}
        <TYPE.subHeader>Confirm this transaction in your wallet</TYPE.subHeader>
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  );
}

export function SubmittedView({
  children,
  onDismiss,
  hash,
}: {
  children: any;
  onDismiss: () => void;
  hash: string | undefined;
}) {
  const theme = useContext(ThemeContext);
  // const { chainId } = useActiveWeb3React()
  const chainId = ChainId.ARBITRUM_NOVA;
  const blockchain = useBlockchain(chainId);
  const explorerName = getExplorerName(blockchain);

  return (
    <ConfirmOrLoadingWrapper>
      <RowBetween>
        <div />
        <CloseIcon onClick={onDismiss} />
      </RowBetween>
      <ConfirmedIcon>
        <FiArrowUpCircle strokeWidth={0.5} size={90} color={theme.primary1} />
      </ConfirmedIcon>
      <AutoColumn gap="100px" justify={"center"}>
        {children}
        {chainId && hash && (
          <ExternalLink
            href={getEtherscanLink(chainId, hash, "transaction")}
            style={{ marginLeft: "4px" }}
          >
            <TYPE.subHeader>View transaction on {explorerName}</TYPE.subHeader>
          </ExternalLink>
        )}
      </AutoColumn>
    </ConfirmOrLoadingWrapper>
  );
}