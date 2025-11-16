
import React from "react";

interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

interface NFTAttributeGridProps {
  attributes: NFTAttribute[];
}

const NFTAttributeGrid: React.FC<NFTAttributeGridProps> = ({ attributes }) => {
  if (!attributes || attributes.length === 0) {
    return <p className="text-muted-foreground">No attributes found</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {attributes.map((attribute, index) => (
        <div
          key={index}
          className="bg-card border rounded-lg p-4 text-center transition-colors hover:bg-accent/50"
        >
          <p className="text-sm text-muted-foreground mb-1">{attribute.trait_type}</p>
          <p className="font-medium truncate">{attribute.value.toString()}</p>
        </div>
      ))}
    </div>
  );
};

export default NFTAttributeGrid;
