import React, { useContext } from "react";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import styled, { ThemeContext } from "styled-components";
import { TYPE } from "../../theme";
import { StyledInternalLink } from "../../theme/components";
import { getEtherscanLink } from "../../utils1";
import { AutoColumn } from "../Column";
import { AutoRow } from "../Row";
import useBlockchain from "../../hooks/useBlockchain";
import getExplorerName from "../../utils1/getExplorerName";
import { ChainId } from "@rcpswap/sdk";

const RowNoFlex = styled(AutoRow)`
  flex-wrap: nowrap;
`;

export default function TransactionPopup({
  hash,
  success,
  summary,
}: {
  hash: string;
  success?: boolean;
  summary?: string;
}) {
  // const { chainId } = useActiveWeb3React()
  const chainId = ChainId.ARBITRUM_NOVA;
  const theme = useContext(ThemeContext);
  const blockchain = useBlockchain(chainId);
  const explorerName = getExplorerName(blockchain);

  return (
    <RowNoFlex>
      <div style={{ paddingRight: 16 }}>
        {success ? (
          <FiCheckCircle color={theme?.green1} size={24} />
        ) : (
          <FiAlertCircle color={theme?.red1} size={24} />
        )}
      </div>
      <AutoColumn gap="8px">
        <TYPE.body fontWeight={500}>
          {summary ?? "Hash: " + hash.slice(0, 8) + "..." + hash.slice(58, 65)}
        </TYPE.body>
        {chainId && (
          <StyledInternalLink
            href={getEtherscanLink(chainId, hash, "transaction")}
            target="_blank"
            rel="noreferrer"
          >
            View on {explorerName}
          </StyledInternalLink>
        )}
      </AutoColumn>
    </RowNoFlex>
  );
}
