"use client";

import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { TYPE, StyledInternalLink } from "../../theme";

import { useBlockNumber } from "wagmi";
import { getEtherscanLink } from "@rcpswap/wagmi/utils";
import { ChainId } from "rcpswap/chain";

const StyledPolling = styled.div`
  position: fixed;
  display: flex;
  right: 0;
  bottom: 0;
  padding: 1rem;
  color: white;
  transition: opacity 0.25s ease;
  color: ${({ theme }) => theme.green1};
  :hover {
    opacity: 1;
  }

  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `}
`;
const StyledPollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-left: 0.5rem;
  margin-top: 3px;
  border-radius: 50%;
  position: relative;
  background-color: ${({ theme }) => theme.green1};
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 1s cubic-bezier(0.83, 0, 0.17, 1) infinite;
  transform: translateZ(0);

  border-top: 1px solid transparent;
  border-right: 1px solid transparent;
  border-bottom: 1px solid transparent;
  border-left: 2px solid ${({ theme }) => theme.green1};
  background: transparent;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: relative;

  left: -3px;
  top: -3px;
`;

export default function Polling() {
  const { data: blockNumber } = useBlockNumber({
    chainId: ChainId.ARBITRUM_NOVA,
    watch: true,
  });

  const [isMounted, setIsMounted] = useState(true);

  useEffect(
    () => {
      const timer1 = setTimeout(() => setIsMounted(true), 1000);

      // this will clear Timeout when component unmount like in willComponentUnmount
      return () => {
        setIsMounted(false);
        clearTimeout(timer1);
      };
    },
    [blockNumber] //useEffect will run only one time
    //if you pass a value to array, like this [data] than clearTimeout will run every time this value changes (useEffect re-run)
  );

  return (
    <StyledInternalLink
      href={
        blockNumber
          ? getEtherscanLink(
              ChainId.ARBITRUM_NOVA,
              blockNumber.toString(),
              "block"
            )
          : ""
      }
      target="_blank"
      rel="noreferrer"
    >
      <StyledPolling>
        <TYPE.mediumHeader
          style={{ opacity: isMounted ? "0.5" : "0.8", fontSize: "16px" }}
        >
          {blockNumber?.toString()}
        </TYPE.mediumHeader>
        <StyledPollingDot>{!isMounted && <Spinner />}</StyledPollingDot>
      </StyledPolling>
    </StyledInternalLink>
  );
}
