
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const FactsMarquee = () => {
  const [artistCount, setArtistCount] = useState(2500);
  const [fanCount, setFanCount] = useState(15000);
  const [transactionCount, setTransactionCount] = useState(45000);
  
  // Simulate data fetching on component mount
  useEffect(() => {
    // This would be replaced with actual API calls to fetch real stats
    const fetchStats = async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set slightly randomized values to simulate real-time data
      setArtistCount(2500 + Math.floor(Math.random() * 100));
      setFanCount(15000 + Math.floor(Math.random() * 500));
      setTransactionCount(45000 + Math.floor(Math.random() * 1000));
    };
    
    fetchStats();
    // Optional: could setup a real-time subscription or polling here
  }, []);
  
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const facts = [
    {
      icon: <Sparkles className="text-primary" />,
      text: `${formatNumber(artistCount)}+ Artists Onboarded`
    },
    {
      icon: <Sparkles className="text-primary" />,
      text: `${formatNumber(fanCount)}+ Active Fans`
    },
    {
      icon: <Sparkles className="text-primary" />,
      text: `${formatNumber(transactionCount)}+ JestCoin Transactions`
    },
    {
      icon: <Sparkles className="text-primary" />,
      text: "Join the Future of Music"
    }
  ];

  return (
    <div className="py-4 bg-black/40 backdrop-blur-md border-y border-white/10 overflow-hidden">
      <div className="flex items-center">
        <motion.div 
          className="flex whitespace-nowrap"
          animate={{
            x: ["0%", "-50%"],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {[...facts, ...facts].map((fact, index) => (
            <div key={index} className="flex items-center px-8">
              <div className="mr-2">{fact.icon}</div>
              <span className="text-white/90 font-medium">{fact.text}</span>
              <span className="mx-4 text-white/30">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default FactsMarquee;
