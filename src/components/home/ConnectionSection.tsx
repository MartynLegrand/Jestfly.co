
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Instagram, Twitter, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Container from "@/components/ui/Container";
import { useToast } from "@/components/ui/use-toast";

const ConnectionSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Subscribed!",
      description: "You've been added to our newsletter.",
    });
    
    setEmail("");
    setIsSubmitting(false);
  };

  const socialLinks = [
    { 
      name: "Twitter", 
      icon: Twitter, 
      url: "https://twitter.com/jestfly", 
      color: "bg-[#1DA1F2]"
    },
    { 
      name: "Instagram", 
      icon: Instagram, 
      url: "https://instagram.com/jestfly", 
      color: "bg-[#E1306C]"
    },
    { 
      name: "Contact", 
      icon: Mail, 
      url: "mailto:hello@jestfly.com", 
      color: "bg-primary" 
    },
    { 
      name: "Listen", 
      icon: Headphones, 
      url: "/community", 
      color: "bg-[#1ED760]" 
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-t from-black/90 to-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Stay Connected</h2>
            <p className="text-muted-foreground mb-8 max-w-lg">
              Subscribe to our newsletter for the latest updates on artists, drops, and exclusive events.
            </p>
            
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow"
                  required
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Subscribe
                      <Send className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect with us</h3>
              <div className="flex flex-wrap gap-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    className={`${link.color} hover:opacity-90 transition-opacity rounded-full p-3 text-white flex items-center justify-center`}
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <link.icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glass card with decorative elements */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-lg blur-xl opacity-70" />
              <div className="glass-card p-8 relative z-10">
                <h3 className="text-2xl font-bold mb-4">Join Our Community</h3>
                <p className="text-muted-foreground mb-6">
                  JESTFLY is more than a platform—it's a community of creators and fans who are shaping the future of music in the Web3 space.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded text-primary mr-4">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Support</h4>
                      <p className="text-sm text-muted-foreground">help@jestfly.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-primary/10 p-2 rounded text-primary mr-4">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-medium">Artist Relations</h4>
                      <p className="text-sm text-muted-foreground">artists@jestfly.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
            <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-purple-500/20 rounded-full blur-xl" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default ConnectionSection;
