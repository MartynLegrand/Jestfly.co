
import React from "react";
import GlassCard from "@/components/ui/GlassCard";

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: "What is JestCoin?",
    answer: "JestCoin is JESTFLY's digital currency that powers transactions within our platform. It enables direct support between fans and artists."
  },
  {
    question: "How do I earn JestCoins?",
    answer: "You can earn JestCoins by participating in the community, completing tasks, or purchasing them directly from the platform."
  },
  {
    question: "What can I do with JestCoins?",
    answer: "JestCoins can be used to purchase exclusive content, tip artists, access premium features, and more within the JESTFLY ecosystem."
  }
];

const JestCoinFaq = () => {
  return (
    <GlassCard>
      <h2 className="text-xl font-semibold mb-6">JestCoin FAQs</h2>
      
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <div key={index}>
            <h3 className="font-semibold mb-2">{item.question}</h3>
            <p className="text-muted-foreground">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

export default JestCoinFaq;
