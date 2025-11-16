
import { useState, useEffect, Suspense } from "react";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import Container from "@/components/ui/Container";
import { useAuth } from "@/context/AuthContext";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { isWebGLAvailable } from "./crystal/webglUtils";
import Safe3DCanvas from "./crystal/Safe3DCanvas";
import Crystal from "./crystal/Crystal";
import CrystalFallback from "./crystal/CrystalFallback";
import HeroContent from "./crystal/HeroContent";

const CrystalHero = () => {
  console.log("CrystalHero component rendering");
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [showCanvas, setShowCanvas] = useState(true);
  
  useEffect(() => {
    console.log("CrystalHero mounted, user:", user);
    setIsMounted(true);
    
    return () => {
      console.log("CrystalHero unmounted");
      setIsMounted(false);
    };
  }, [user]);

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-jestfly-dark via-jestfly-purple/20 to-background" />
      
      <div className="absolute inset-0 opacity-90 z-0">
        {isMounted && showCanvas && (
          <ErrorBoundary 
            fallback={<CrystalFallback />}
            onError={(error) => {
              console.error("Three.js outer error:", error);
              setShowCanvas(false);
            }}
          >
            <Suspense fallback={<CrystalFallback />}>
              {isWebGLAvailable() ? (
                <Safe3DCanvas>
                  <ambientLight intensity={0.5} />
                  <spotLight 
                    position={[10, 10, 10]} 
                    angle={0.15} 
                    penumbra={1} 
                    intensity={1} 
                    castShadow 
                  />
                  <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.5}>
                    <Crystal position={[0, 0, 0]} scale={1.8} />
                  </Float>
                  <Environment preset="city" />
                  <OrbitControls 
                    enableZoom={false} 
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    maxPolarAngle={Math.PI / 2}
                    minPolarAngle={Math.PI / 2.5}
                  />
                </Safe3DCanvas>
              ) : (
                <CrystalFallback />
              )}
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
      
      <Container className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white pt-20">
        <HeroContent user={user} />
      </Container>
    </section>
  );
};

export default CrystalHero;
