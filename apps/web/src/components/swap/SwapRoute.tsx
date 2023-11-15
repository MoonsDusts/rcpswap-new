import { Trade } from "@rcpswap/sdk";
import React, { Fragment, memo, useContext } from "react";
import { FiChevronRight } from "react-icons/fi";
import { Flex } from "rebass";
import { ThemeContext } from "styled-components";

import { TYPE } from "@/theme";
import { unwrappedToken } from "@/utils1/wrappedCurrency";

export default memo(function SwapRoute({ trade }: { trade: Trade }) {
  const theme = useContext(ThemeContext);
  return (
    <Flex
      flexWrap="wrap"
      width="100%"
      justifyContent="flex-end"
      alignItems="center"
    >
      {trade.route.path.map((token, i, path) => {
        const isLastItem: boolean = i === path.length - 1;
        const currency = unwrappedToken(token);
        return (
          <Fragment key={i}>
            <Flex alignItems="end">
              <TYPE.black
                fontSize={14}
                color={theme?.text1}
                ml="0.125rem"
                mr="0.125rem"
              >
                {currency.symbol}
              </TYPE.black>
            </Flex>
            {isLastItem ? null : (
              <FiChevronRight size={12} color={theme?.text2} />
            )}
          </Fragment>
        );
      })}
    </Flex>
  );
});
