
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Container from "@/components/ui/Container";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  artist: string;
  link: string;
}

const CrystalGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  
  const images: GalleryImage[] = [
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80",
      title: "Neon Dreams",
      artist: "Luna Nova",
      link: "/community"
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1593697821252-0c9137d9fc45?w=400&auto=format&fit=crop&q=80",
      title: "Crystal Harmony",
      artist: "Astral Echoes",
      link: "/community"
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1614102073832-030967418971?w=400&auto=format&fit=crop&q=80",
      title: "Digital Reflections",
      artist: "Digital Frost",
      link: "/community"
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&auto=format&fit=crop&q=80",
      title: "Northern Lights",
      artist: "Quantum Flux",
      link: "/community"
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=400&auto=format&fit=crop&q=80",
      title: "Spectrum",
      artist: "Luna Nova",
      link: "/community"
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?w=400&auto=format&fit=crop&q=80",
      title: "Vibrant Flow",
      artist: "Digital Frost",
      link: "/community"
    }
  ];
  
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-black/80" ref={containerRef}>
      <Container>
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Artist Gallery</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore stunning digital artwork from the JESTFLY community.
            </p>
          </motion.div>
        </div>
        
        <motion.div style={{ y }} className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              className="relative group aspect-square"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              onMouseEnter={() => setHoveredImage(image.id)}
              onMouseLeave={() => setHoveredImage(null)}
            >
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <img 
                  src={image.url} 
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Crystal overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Image info overlay */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredImage === image.id ? 1 : 0,
                      y: hoveredImage === image.id ? 0 : 10
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-white font-medium">{image.title}</h3>
                    <p className="text-white/80 text-sm">{image.artist}</p>
                    
                    <a 
                      href={image.link} 
                      className="absolute top-4 right-4 bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </motion.div>
                </div>
              </div>
              
              {/* Crystal prism effect around edges on hover */}
              <motion.div 
                className="absolute inset-0 rounded-lg pointer-events-none"
                animate={{ 
                  boxShadow: hoveredImage === image.id 
                    ? "0 0 20px 0 rgba(139, 92, 246, 0.5), inset 0 0 20px 0 rgba(139, 92, 246, 0.3)" 
                    : "none"
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
};

export default CrystalGallery;
