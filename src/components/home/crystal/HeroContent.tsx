
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AuthUser } from "@/types";

interface HeroContentProps {
  user: AuthUser | null;
}

const HeroContent = ({ user }: HeroContentProps) => {
  return (
    <motion.div
      className="glass p-8 rounded-xl backdrop-blur-md max-w-3xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <motion.h1 
        className="text-5xl md:text-7xl font-bold font-display mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-gradient">JESTFLY</span>
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl mb-2 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        The Future of Music in Web3
      </motion.p>
      
      <motion.p 
        className="text-lg text-white/80 mb-8 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Create, connect, and earn in a decentralized ecosystem built for artists and fans
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {user ? (
          <>
            <Button size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30" asChild>
              <Link to="/profile">My Profile</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/community">Explore Community</Link>
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" className="bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;
