
import React from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Wallet, Gift } from "lucide-react";

const ServiceCard = ({ 
  title, 
  description, 
  icon: Icon, 
  buttonText, 
  buttonAction,
  comingSoon = false
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  buttonText: string;
  buttonAction?: () => void;
  comingSoon?: boolean;
}) => (
  <GlassCard className="text-center p-6">
    <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-4">
      {description}
    </p>
    <Button 
      variant="outline" 
      size="sm" 
      onClick={buttonAction}
      disabled={comingSoon}
    >
      {buttonText}
    </Button>
  </GlassCard>
);

const JestCoinServices = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <ServiceCard 
        title="Shop" 
        description="Use JestCoins to purchase exclusive content from your favorite artists"
        icon={ShoppingBag}
        buttonText="Visit Store"
        buttonAction={() => navigate("/store")}
      />

      <ServiceCard 
        title="Wallet" 
        description="Manage your JestCoins, send and receive payments securely"
        icon={Wallet}
        buttonText="Open Wallet"
        buttonAction={() => navigate("/wallet")}
      />

      <ServiceCard 
        title="Rewards" 
        description="Complete tasks and earn JestCoins as rewards"
        icon={Gift}
        buttonText="Coming Soon"
        comingSoon
      />
    </div>
  );
};

export default JestCoinServices;
