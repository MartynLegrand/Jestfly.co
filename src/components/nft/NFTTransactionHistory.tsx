
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink } from "lucide-react";

interface Transaction {
  id: string;
  from: string;
  to: string;
  price: number;
  timestamp: string;
  type: string;
}

interface NFTTransactionHistoryProps {
  transactions: Transaction[];
}

const NFTTransactionHistory: React.FC<NFTTransactionHistoryProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No transaction history available</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-4 gap-2 p-4 font-medium bg-muted/50">
        <div>Event</div>
        <div>Price</div>
        <div>From/To</div>
        <div>Date</div>
      </div>
      <div className="divide-y">
        {transactions.map((tx) => (
          <div key={tx.id} className="grid grid-cols-4 gap-2 p-4">
            <div className="font-medium">{tx.type}</div>
            <div>{tx.price} JC</div>
            <div className="text-sm truncate">
              {tx.type === "Mint" ? tx.to : `${shortenAddress(tx.from)} → ${shortenAddress(tx.to)}`}
            </div>
            <div className="flex items-center gap-2 text-sm">
              {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
              <a
                href={`https://etherscan.io/tx/${tx.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to shorten addresses
function shortenAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export default NFTTransactionHistory;
