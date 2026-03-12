import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import type { SimpleTransfer } from "@marginal-card/platform-sdk";

import { platformSDK } from "@/modules/platform/platformSDK.ts";

interface DataContextType {
  transactions: SimpleTransfer[];
  areTransactionsLoading: boolean;
  loadTransactions: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const DataContext = createContext<DataContextType>(null!);

export const DataContextProvider = ({ children }: PropsWithChildren) => {
  const [transactions, setTransactions] = useState<SimpleTransfer[]>([]);
  const [areTransactionsLoading, setAreTransactionsLoading] = useState(true);
  const loadTransactions = useCallback(() => {
    if (transactions.length > 0) return;

    platformSDK.transfer.allMines().then((response) => {
      setTransactions(response.transfers);
      setAreTransactionsLoading(false);
    });
  }, [transactions.length]);

  const value = useMemo(
    () => ({
      transactions,
      areTransactionsLoading,
      loadTransactions,
    }),
    [areTransactionsLoading, loadTransactions, transactions],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
