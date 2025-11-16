
import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";
import { ChevronRight } from "lucide-react";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import * as THREE from "three";

// NFT Model component that renders a simple glowing cube
const NftModel = ({ color = "#8B5CF6" }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.4}
        roughness={0.1} 
        metalness={0.8}
        clearcoat={1}
      />
    </mesh>
  );
};

// Fallback component when 3D rendering fails
const NftFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-primary/5 rounded-lg">
    <div className="text-center p-8">
      <div className="w-24 h-24 mx-auto mb-4 rounded-lg bg-primary/20 animate-pulse" />
      <p className="text-muted-foreground">Loading 3D model...</p>
    </div>
  </div>
);

// Safe Canvas that only renders on client-side and handles errors gracefully
const Safe3DCanvas = ({ children, ...props }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (hasError) {
    return <NftFallback />;
  }

  if (!isMounted) {
    return <NftFallback />;
  }

  return (
    <ErrorBoundary fallback={<NftFallback />} onError={() => setHasError(true)}>
      <Suspense fallback={<NftFallback />}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 40 }} {...props}>
          {children}
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  );
};

interface Nft {
  id: string;
  title: string;
  artist: string;
  price: number;
  color: string;
}

const NftSection = () => {
  const [selectedNft, setSelectedNft] = useState<Nft | null>(null);
  const [canRender3D, setCanRender3D] = useState(false);
  
  useEffect(() => {
    // Only enable 3D rendering after component mount to avoid SSR issues
    setCanRender3D(true);
  }, []);
  
  const nfts: Nft[] = [
    { id: "1", title: "Digital Harmony", artist: "Luna Nova", price: 250, color: "#9333EA" },
    { id: "2", title: "Cosmic Echo", artist: "Astral Echoes", price: 320, color: "#4F46E5" },
    { id: "3", title: "Neural Beat", artist: "Digital Frost", price: 180, color: "#EC4899" },
    { id: "4", title: "Quantum Spark", artist: "Quantum Flux", price: 420, color: "#14B8A6" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black/80 to-background">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Collect Digital Music NFTs</h2>
            <p className="text-muted-foreground mb-8 max-w-lg">
              Own exclusive digital collectibles from your favorite artists. Each NFT grants special access to content, experiences, and community benefits.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {nfts.map((nft) => (
                <GlassCard
                  key={nft.id}
                  className={`p-4 cursor-pointer transition-all duration-300 ${selectedNft?.id === nft.id ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedNft(nft)}
                >
                  <h3 className="font-medium mb-1">{nft.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">by {nft.artist}</p>
                  <p className="text-primary font-semibold">{nft.price} JC</p>
                </GlassCard>
              ))}
            </div>
            
            <Button className="ml-auto" asChild>
              <Link to="/store" className="flex items-center">
                Explore NFT Marketplace
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:order-2 order-1 h-[400px]"
          >
            <div className="w-full h-full relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg" />
              
              {canRender3D ? (
                <Safe3DCanvas>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <NftModel color={selectedNft?.color || "#8B5CF6"} />
                  <Environment preset="city" />
                  <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={1}
                  />
                </Safe3DCanvas>
              ) : (
                <NftFallback />
              )}
              
              {/* Glow effect */}
              <div 
                className="absolute inset-0 -z-10 blur-2xl opacity-30" 
                style={{ backgroundColor: selectedNft?.color || "#8B5CF6" }} 
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
};

export default NftSection;
