
import React from "react";
import { useWallet } from "@/context/WalletContext";
import { Transaction } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownLeft, Gift, ShoppingBag, RotateCcw } from "lucide-react";
import { format } from "date-fns";

interface TransactionListProps {
  filter?: 'all' | 'received' | 'sent';
}

const TransactionIcon = ({ type, amount }: { type: Transaction["transaction_type"], amount: number }) => {
  if (amount > 0) {
    switch(type) {
      case "transfer":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "reward":
        return <Gift className="h-4 w-4 text-purple-500" />;
      case "refund":
        return <RotateCcw className="h-4 w-4 text-blue-500" />;
      default:
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    }
  } else {
    switch(type) {
      case "transfer":
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
      case "purchase":
        return <ShoppingBag className="h-4 w-4 text-pink-500" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />;
    }
  }
};

const TransactionDescription = ({ transaction }: { transaction: Transaction }) => {
  const type = transaction.transaction_type;
  const isPositive = transaction.amount > 0;
  
  switch(type) {
    case "transfer":
      return isPositive ? "Received JestCoins" : "Sent JestCoins";
    case "reward":
      return "Reward Received";
    case "purchase":
      return "Purchase";
    case "refund":
      return "Refund";
    default:
      return "Transaction";
  }
};

const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-secondary">
          <TransactionIcon type={transaction.transaction_type} amount={transaction.amount} />
        </div>
        <div>
          <p className="font-medium text-sm">
            <TransactionDescription transaction={transaction} />
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(transaction.created_at), "MMM d, yyyy · HH:mm")}
          </p>
        </div>
      </div>
      <div className={`font-semibold ${transaction.amount > 0 ? "text-green-500" : ""}`}>
        {transaction.amount > 0 ? "+" : ""}{transaction.amount} JC
      </div>
    </div>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ filter = 'all' }) => {
  const { transactions, isLoading } = useWallet();
  
  // Filter transactions based on the selected filter
  const filteredTransactions = React.useMemo(() => {
    if (filter === 'all') return transactions;
    if (filter === 'received') return transactions.filter(t => t.amount > 0);
    if (filter === 'sent') return transactions.filter(t => t.amount < 0);
    return transactions;
  }, [transactions, filter]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-1" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (!filteredTransactions.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No transactions {filter !== 'all' ? `in "${filter}" category` : ''} yet</p>
        <p className="text-sm mt-1">Your transaction history will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {filteredTransactions.map((transaction) => (
        <TransactionItem key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
};

export default TransactionList;
