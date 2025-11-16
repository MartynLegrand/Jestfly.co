
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { makeStreamDonation } from '@/lib/streaming';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Gift, Heart, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DonationPanelProps {
  streamId: string;
  channelName: string;
  className?: string;
}

const DONATION_AMOUNTS = [5, 10, 20, 50, 100];

const DonationPanel = ({ streamId, channelName, className = '' }: DonationPanelProps) => {
  const { user } = useAuth();
  const { wallet, refreshWallet } = useWallet();
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDonate = async () => {
    if (!user || !wallet) return;
    
    const donationAmount = Number(customAmount) || amount;
    
    if (isNaN(donationAmount) || donationAmount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido maior que zero.",
        variant: "destructive"
      });
      return;
    }
    
    if (donationAmount > wallet.balance) {
      toast({
        title: "Saldo insuficiente",
        description: "Você não tem JestCoins suficientes para fazer esta doação.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      const result = await makeStreamDonation({
        stream_id: streamId,
        donor_id: user.id,
        amount: donationAmount,
        message: message.trim() || undefined
      });
      
      if (!result.success) {
        throw new Error("Erro ao processar doação");
      }
      
      toast({
        title: "Doação realizada com sucesso!",
        description: `Você doou ${donationAmount} JestCoins para ${channelName}.`,
      });
      
      // Limpar formulário
      setCustomAmount('');
      setMessage('');
      
      // Atualizar saldo da carteira
      refreshWallet();
      
    } catch (error) {
      console.error('Erro ao fazer doação:', error);
      toast({
        title: "Erro ao processar doação",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar sua doação.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || !wallet) {
    return null;
  }

  const actualAmount = Number(customAmount) || amount;
  const canDonate = !isProcessing && actualAmount > 0 && actualAmount <= wallet.balance;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Gift className="h-5 w-5 mr-2 text-primary" />
          Apoiar o streamer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm mb-2">Escolha um valor ou insira um personalizado:</p>
            <div className="flex flex-wrap gap-2">
              {DONATION_AMOUNTS.map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={amount === value && !customAmount ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setAmount(value);
                    setCustomAmount('');
                  }}
                  className="flex items-center"
                >
                  {value} <JestCoinIcon className="h-3 w-3 ml-1" />
                </Button>
              ))}
              
              <div className="flex-1 min-w-[100px]">
                <Input
                  type="number"
                  min="1"
                  placeholder="Outro valor"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="h-9 text-sm"
                />
              </div>
            </div>
          </div>
          
          <div>
            <p className="text-sm mb-2">Mensagem (opcional):</p>
            <Textarea
              placeholder="Adicione uma mensagem para o streamer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              rows={2}
              className="resize-none"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between bg-muted p-3 rounded-md text-sm">
            <div className="flex items-center mb-2 sm:mb-0">
              <JestCoinIcon className="h-4 w-4 mr-1 text-yellow-500" />
              <span>Seu saldo: <strong>{wallet.balance} JestCoins</strong></span>
            </div>
            
            {actualAmount > wallet.balance && (
              <div className="flex items-center text-destructive">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Saldo insuficiente</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleDonate}
          disabled={!canDonate}
          className="w-full"
        >
          <Heart className="h-4 w-4 mr-2" />
          Doar {actualAmount} JestCoins
        </Button>
      </CardFooter>
    </Card>
  );
};

// Ícone simples para JestCoin - renomeado para JestCoinIcon para evitar confusão
const JestCoinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

export default DonationPanel;
