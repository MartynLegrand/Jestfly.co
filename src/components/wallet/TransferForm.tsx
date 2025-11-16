
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UserSearch from "./UserSearch";

interface TransferFormProps {
  selectedUser: any | null;
  setSelectedUser: (user: any) => void;
  amount: string;
  setAmount: (amount: string) => void;
  description: string;
  setDescription: (description: string) => void;
  currentUserId?: string;
}

const TransferForm: React.FC<TransferFormProps> = ({
  selectedUser,
  setSelectedUser,
  amount,
  setAmount,
  description,
  setDescription,
  currentUserId
}) => {
  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient</Label>
        <UserSearch 
          selectedUser={selectedUser} 
          onSelectUser={setSelectedUser}
          currentUserId={currentUserId}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (JC)</Label>
        <Input
          id="amount"
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this transfer for?"
        />
      </div>
    </div>
  );
};

export default TransferForm;
