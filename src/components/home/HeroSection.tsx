
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBjb3ZlcnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fG11c2ljfGVufDB8fDB8fHww"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Content */}
      <Container className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white pt-20">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold font-display mb-4"
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
          The Web3 Platform for Artists and Fans
        </motion.p>
        
        <motion.p 
          className="text-lg text-white/80 mb-8 max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Create, connect, and earn in a decentralized ecosystem
        </motion.p>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {user ? (
            <>
              <Button size="lg" asChild>
                <Link to="/profile">My Profile</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/community">Explore Community</Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </>
          )}
        </motion.div>
      </Container>
    </section>
  );
};

export default HeroSection;
