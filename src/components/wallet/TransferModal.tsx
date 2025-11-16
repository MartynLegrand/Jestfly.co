
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { transferJestCoins } from "@/lib/wallet"; // Updated to import from the new wallet module
import { useAuth } from "@/context/AuthContext";
import { useWallet } from "@/context/WalletContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import TransferForm from "./TransferForm";

interface TransferModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransferModal: React.FC<TransferModalProps> = ({ open, onOpenChange }) => {
  const { user } = useAuth();
  const { wallet, refreshWallet, refreshTransactions } = useWallet();
  const { toast } = useToast();
  
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTransfer = async () => {
    if (!user || !selectedUser || !wallet) return;
    
    const amountNum = parseFloat(amount);
    
    if (isNaN(amountNum) || amountNum <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido maior que 0",
        variant: "destructive",
      });
      return;
    }
    
    if (amountNum > wallet.balance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem JestCoins suficientes para esta transferência",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await transferJestCoins(
        user.id,
        selectedUser.id,
        amountNum,
        description
      );
      
      if (result.success) {
        toast({
          title: "Transferência realizada com sucesso",
          description: `Você enviou ${amountNum} JestCoins para ${selectedUser.display_name || selectedUser.username}`,
        });
        
        setSelectedUser(null);
        setAmount("");
        setDescription("");
        onOpenChange(false);
        
        await refreshWallet();
        await refreshTransactions();
      } else {
        toast({
          title: "Falha na transferência",
          description: result.message || "Ocorreu um erro",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Falha na transferência",
        description: error.message || "Ocorreu um erro inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar JestCoins</DialogTitle>
          <DialogDescription>
            Transfira JestCoins para outro usuário na plataforma.
          </DialogDescription>
        </DialogHeader>
        
        <TransferForm
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          amount={amount}
          setAmount={setAmount}
          description={description}
          setDescription={setDescription}
          currentUserId={user?.id}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleTransfer} 
            disabled={!selectedUser || !amount || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...
              </>
            ) : (
              "Enviar JestCoins"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferModal;
