
import React from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import WalletDisplay from "@/components/wallet/WalletDisplay";

const JestCoinHero = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="md:col-span-2">
        <GlassCard className="p-6 bg-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-3">Welcome to JestCoin</h2>
            <p className="text-white/80 mb-6">
              JestCoin is the official currency of JESTFLY. Use it to tip artists, purchase exclusive content, and support creators you love.
            </p>
            <Button 
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate("/wallet")}
            >
              Go to Wallet <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </GlassCard>
      </div>
      
      <div>
        <WalletDisplay minimal />
      </div>
    </div>
  );
};

export default JestCoinHero;
