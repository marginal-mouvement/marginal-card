import { use, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

import { Header } from "@/parts/header.tsx";
import { Content } from "@/parts/content.tsx";
import { DataContext } from "@/modules/data/data.context.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item.tsx";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { DateFormatter } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";

export const TransactionsPage = () => {
  const { loadTransactions, transactions, areTransactionsLoading } =
    use(DataContext);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <>
      <Header title="Transactions" />
      <Content withHeader>
        {areTransactionsLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : transactions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {transactions.map((transaction) => (
              <Item key={transaction.id} variant="outline">
                <ItemMedia>
                  <Avatar size="lg">
                    <AvatarImage src={transaction.thumbnailUrl} />
                    <AvatarFallback>
                      {transaction.label.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{transaction.label}</ItemTitle>
                  <ItemDescription>
                    {DateFormatter.format(new Date(transaction.date))}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Badge
                    variant={
                      transaction.kind === "credit" ? "default" : "destructive"
                    }
                  >
                    {transaction.kind === "credit" ? <Plus /> : <Minus />}
                    {transaction.amount}
                  </Badge>
                </ItemActions>
              </Item>
            ))}
          </div>
        ) : (
          <div>Aucune transaction</div>
        )}
      </Content>
    </>
  );
};
