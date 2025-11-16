
import { useState, useEffect, ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import CrystalFallback from "./CrystalFallback";
import { isWebGLAvailable } from "./webglUtils";
import * as THREE from "three";

interface Safe3DCanvasProps {
  children: ReactNode;
  [key: string]: any;
}

const Safe3DCanvas = ({ children, ...props }: Safe3DCanvasProps) => {
  const [hasError, setHasError] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  
  useEffect(() => {
    console.log("Safe3DCanvas mounted");
    const supported = isWebGLAvailable();
    console.log("WebGL supported:", supported);
    setIsSupported(supported);
    
    return () => {
      console.log("Safe3DCanvas unmounted");
    };
  }, []);

  if (hasError || !isSupported) {
    console.log("Rendering fallback due to error or lack of support");
    return <CrystalFallback />;
  }

  return (
    <ErrorBoundary 
      fallback={<CrystalFallback />} 
      onError={(error) => {
        console.error("Three.js rendering error:", error);
        setHasError(true);
      }}
    >
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        dpr={[1, 2]} 
        {...props}
        onCreated={({ gl }) => {
          console.log("Canvas created successfully");
          gl.setClearColor(new THREE.Color('#060818'), 0);
        }}
      >
        {children}
      </Canvas>
    </ErrorBoundary>
  );
};

export default Safe3DCanvas;
