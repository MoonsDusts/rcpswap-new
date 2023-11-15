"use client";

import { useSlippageTolerance } from "@rcpswap/hooks";
import {
  Address,
  useAccount,
  useClientTrade,
  useFeeData,
} from "@rcpswap/wagmi";
import {
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { ChainId } from "rcpswap/chain";
import { Type, tryParseAmount } from "rcpswap/currency";
import { ZERO } from "rcpswap/math";

interface State {
  mutate: {
    setChainId0(chainId: ChainId): void;
    setChainId1(chainId: ChainId): void;
    setToken0(token0: Type | undefined): void;
    setToken1(token1: Type | undefined): void;
    setSwapAmount(swapAmount: string): void;
    switchTokens(): void;
    switchSwapMode(): void;
    setRecipient(address: string | undefined): void;
    setUltraMode(mode: boolean): void;
    setSwapSlidePercentage: (value: number) => void;
  };
  state: {
    token0: Type | undefined;
    token1: Type | undefined;
    chainId0: ChainId;
    chainId1: ChainId;
    swapAmount: string | undefined;
    recipient: string | undefined;
    swapMode: number;
    ultraMode: boolean;
    swapSlidePercentage: number;
  };
}

const DerivedSwapStateContext = createContext<State>({} as State);

interface DerivedSwapStateProviderProps {
  children: React.ReactNode;
}

const DerivedSwapStateProvider: FC<DerivedSwapStateProviderProps> = ({
  children,
}) => {
  const { address } = useAccount();

  const [chainId0, setChainId0] = useState<ChainId>(ChainId.ARBITRUM_NOVA);
  const [chainId1, setChainId1] = useState<ChainId>(ChainId.ARBITRUM_NOVA);
  const [swapMode, setSwapMode] = useState(0);
  const [swapAmount, setSwapAmount] = useState<string | undefined>();
  const [token0, setToken0] = useState<Type | undefined>();
  const [token1, setToken1] = useState<Type | undefined>();
  const [recipient, setRecipient] = useState<string | undefined>();
  const [ultraMode, setUltraMode] = useState(false);
  const [swapSlidePercentage, setSwapSlidePercentage] = useState(0);

  const _setChainId0 = useCallback<{ (_chainId: ChainId): void }>(
    (chainId) => {
      setChainId0(chainId);
      setToken0(undefined);
    },
    [setChainId0, setToken0]
  );

  const _setChainId1 = useCallback<{ (_chainId: ChainId): void }>(
    (chainId) => {
      setChainId1(chainId);
      setToken1(undefined);
    },
    [setChainId1, setToken1]
  );

  const _switchToken = useCallback(() => {
    const data = {
      chainId0,
      chainId1,
      token0,
      token1,
    };

    setChainId0(data.chainId1);
    setChainId1(data.chainId0);
    setToken0(data.token1);
    setToken1(data.token0);
  }, [
    chainId0,
    chainId1,
    token0,
    token1,
    setChainId0,
    setChainId1,
    setToken0,
    setToken1,
  ]);

  const _setToken0 = useCallback<{ (_token: Type | undefined): void }>(
    (_token) => {
      if (chainId0 === chainId1 && _token && _token === token1) {
        setToken1(token0);
      }
      setToken0(_token);
    },
    [chainId0, chainId1, token1, setToken0]
  );

  const _setToken1 = useCallback<{ (_token: Type | undefined): void }>(
    (_token) => {
      if (chainId0 === chainId1 && _token && _token === token0) {
        setToken0(token1);
      }
      setToken1(_token);
    },
    [chainId0, chainId1, token0, setToken1]
  );

  const _setSwapAmount = useCallback<{ (value: string): void }>(
    (value) => {
      setSwapAmount(value);
    },
    [setSwapAmount, swapAmount]
  );

  const _switchSwapMode = useCallback<{ (): void }>(() => {
    setSwapMode(1 - swapMode);
  }, [setSwapAmount, swapMode]);

  return (
    <DerivedSwapStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setChainId0: _setChainId0,
            setChainId1: _setChainId1,
            setToken0: _setToken0,
            setToken1: _setToken1,
            switchTokens: _switchToken,
            setSwapAmount: _setSwapAmount,
            switchSwapMode: _switchSwapMode,
            setRecipient,
            setUltraMode,
            setSwapSlidePercentage,
          },
          state: {
            recipient,
            chainId0,
            chainId1,
            swapAmount,
            token0: token0,
            token1: token1,
            swapMode,
            ultraMode,
            swapSlidePercentage,
          },
        };
      }, [
        address,
        _setChainId0,
        _setChainId1,
        _setToken0,
        _setToken1,
        _switchToken,
        _setSwapAmount,
        _switchSwapMode,
        setRecipient,
        recipient,
        token0,
        token1,
        swapAmount,
        swapSlidePercentage,
        setSwapSlidePercentage,
      ])}
    >
      {children}
    </DerivedSwapStateContext.Provider>
  );
};

const useDerivedSwapState = () => {
  const context = useContext(DerivedSwapStateContext);
  if (!context) {
    throw new Error(
      "Hook can only be used inside Simple Swap Derived State Context"
    );
  }

  return context;
};

const useSwapTrade = () => {
  const {
    state: { token0, chainId0, swapAmount, token1, chainId1, recipient },
  } = useDerivedSwapState();

  const parsedAmount = tryParseAmount(swapAmount, token0);

  const [slippageTolerance] = useSlippageTolerance();
  const { data: feeData } = useFeeData({ chainId: chainId0 });

  const clientTrade = useClientTrade({
    chainId: chainId0,
    fromToken: token0,
    toToken: token1,
    amount: parsedAmount,
    slippagePercentage: slippageTolerance === "AUTO" ? "50" : slippageTolerance,
    gasPrice: feeData?.gasPrice,
    recipient: recipient as Address,
    enabled: Boolean(parsedAmount?.greaterThan(ZERO)),
  });

  return clientTrade as ReturnType<typeof useClientTrade>;
};

export { DerivedSwapStateProvider, useDerivedSwapState, useSwapTrade };
