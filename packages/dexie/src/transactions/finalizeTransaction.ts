import { ChainId } from "rcpswap/chain";
import { type SerializableTransactionReceipt } from "./types";

import { db } from '../db'

export const finalizeTransaction = (chainId: ChainId, hash: string, receipt: SerializableTransactionReceipt) => {
  db.transactions.where(['chainId', 'hash']).equals([chainId, hash]).modify({ receipt, confirmedTime: Date.now() })
}