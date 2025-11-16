
import { useRef } from "react";
import * as THREE from "three";

function Crystal(props: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  return (
    <mesh {...props} ref={meshRef} castShadow receiveShadow>
      <icosahedronGeometry args={[1, 2]} />
      <meshPhysicalMaterial 
        color="#8B5CF6" 
        transmission={0.9} 
        roughness={0.1} 
        metalness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.1}
        thickness={1}
        ior={2.5}
      />
    </mesh>
  );
}

export default Crystal;
