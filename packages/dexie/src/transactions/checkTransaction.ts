import { ChainId } from "rcpswap/chain";

import { db } from '../db'

export const checkTransaction = (chainId: ChainId, hash: string, blockNumber: number) => {
  db.transactions.where(['chainId', 'hash']).equals([chainId, hash]).modify({ lastCheckedBlockNumber: blockNumber })
}