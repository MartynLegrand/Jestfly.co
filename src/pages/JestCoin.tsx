
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "@/components/layout/MainLayout";
import Container from "@/components/ui/Container";
import RewardDisplay from "@/components/wallet/RewardDisplay";
import JestCoinHero from "@/components/jestcoin/JestCoinHero";
import JestCoinStats from "@/components/jestcoin/JestCoinStats";
import JestCoinServices from "@/components/jestcoin/JestCoinServices";
import JestCoinFaq from "@/components/jestcoin/JestCoinFaq";

const JestCoin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to view JestCoin information.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [user, loading, navigate, toast]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <p className="text-lg">Loading JestCoin info...</p>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">JestCoin</h1>
          <p className="text-muted-foreground">
            The official digital currency of the JESTFLY platform
          </p>
        </div>

        <JestCoinHero />
        <JestCoinStats />
        
        {/* Rewards Section */}
        <div className="mb-8">
          <RewardDisplay />
        </div>

        <JestCoinServices />
        <JestCoinFaq />
      </div>
    </MainLayout>
  );
};

export default JestCoin;
