
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Music, Users, ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: Music,
      title: "Artist Platform",
      description: "Showcase your music, engage with fans, and monetize your content",
      linkText: "For Artists",
      linkUrl: "/register"
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with artists and fans, discover new music, and join discussions",
      linkText: "Explore Community",
      linkUrl: "/community"
    },
    {
      icon: ShoppingBag,
      title: "Digital Marketplace",
      description: "Buy exclusive content, digital collectibles, and support creators directly",
      linkText: "Visit Store",
      linkUrl: "/store"
    },
    {
      icon: Sparkles,
      title: "JestCoin Economy",
      description: "Our own digital currency for transactions within the platform",
      linkText: "Learn More",
      linkUrl: "/register"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What makes JESTFLY special?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A unique platform that brings together artists, fans, and collaborators in a vibrant ecosystem powered by Web3 technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full flex flex-col">
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 flex-grow">{feature.description}</p>
                <Button variant="link" className="pl-0" asChild>
                  <Link to={feature.linkUrl} className="flex items-center">
                    {feature.linkText}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturesSection;
