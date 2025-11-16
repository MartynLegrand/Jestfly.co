
const CrystalFallback = () => {
  console.log("Rendering CrystalFallback component");
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-white/80">
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full opacity-70 animate-pulse" />
        <p>Interactive crystal visualization</p>
      </div>
    </div>
  );
};

export default CrystalFallback;
