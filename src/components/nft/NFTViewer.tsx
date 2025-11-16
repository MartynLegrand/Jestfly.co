
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { NFT } from "@/types";

interface NFTModelProps {
  url: string;
}

const NFTModel = ({ url }: NFTModelProps) => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#8B5CF6" />
    </mesh>
  );
};

interface NFTViewerProps {
  nft: NFT;
  className?: string;
}

const NFTViewer = ({ nft, className = "" }: NFTViewerProps) => {
  // Safely get the type with a fallback to 'image'
  const nftType = nft.type || 'image';

  if (nftType !== "3d_model") {
    return (
      <div className={`relative aspect-square rounded-lg overflow-hidden ${className}`}>
        {nftType === "video" ? (
          <video
            src={nft.media_url || nft.image_url}
            controls
            className="w-full h-full object-cover"
          />
        ) : nftType === "audio" ? (
          <div className="w-full h-full flex items-center justify-center bg-secondary/10">
            <audio src={nft.media_url || nft.image_url} controls className="w-full max-w-md" />
          </div>
        ) : (
          <img
            src={nft.media_url || nft.image_url}
            alt={nft.title || nft.name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative aspect-square rounded-lg overflow-hidden ${className}`}>
      <Canvas camera={{ position: [0, 0, 3] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <NFTModel url={nft.media_url || nft.image_url} />
          <Environment preset="city" />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default NFTViewer;
