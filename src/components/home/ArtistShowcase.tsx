
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Music, Verified } from "lucide-react";
import { Button } from "@/components/ui/button";
import Container from "@/components/ui/Container";
import GlassCard from "@/components/ui/GlassCard";

// Featured artist type
interface Artist {
  id: string;
  name: string;
  genre: string;
  followers: number;
  imageUrl: string;
  verified: boolean;
}

const ArtistShowcase = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching artists from an API
    const fetchArtists = async () => {
      setIsLoading(true);
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Placeholder data
      const mockArtists: Artist[] = [
        {
          id: "1",
          name: "Luna Nova",
          genre: "Ambient Electronic",
          followers: 12400,
          imageUrl: "https://images.unsplash.com/photo-1500259783852-0ca9ce8a64dc?w=400&auto=format&fit=crop&q=80",
          verified: true
        },
        {
          id: "2",
          name: "Astral Echoes",
          genre: "Progressive Rock",
          followers: 8700,
          imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&auto=format&fit=crop&q=80",
          verified: true
        },
        {
          id: "3",
          name: "Digital Frost",
          genre: "Synthwave",
          followers: 9300,
          imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&auto=format&fit=crop&q=80",
          verified: false
        },
        {
          id: "4",
          name: "Quantum Flux",
          genre: "Experimental",
          followers: 6200,
          imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&auto=format&fit=crop&q=80",
          verified: true
        }
      ];
      
      setArtists(mockArtists);
      setIsLoading(false);
    };
    
    fetchArtists();
  }, []);

  // Format follower count
  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    }
    return count.toString();
  };

  return (
    <section className="py-20 bg-background">
      <Container>
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Featured Artists</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover trending creators pushing the boundaries of music and Web3 technology.
            </p>
          </motion.div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <GlassCard key={i} className="h-full p-0 overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-3 w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded mb-4 w-1/2"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full mt-4"></div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {artists.map((artist, index) => (
              <motion.div 
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <GlassCard className="h-full p-0 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={artist.imageUrl} 
                      alt={artist.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    {artist.verified && (
                      <div className="absolute top-4 right-4 bg-primary/80 p-1.5 rounded-full text-white">
                        <Verified className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{artist.name}</h3>
                      <Music className="h-5 w-5 text-primary/70" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{artist.genre}</p>
                    <div className="text-sm text-muted-foreground mb-4">
                      {formatFollowers(artist.followers)} followers
                    </div>
                    <Button variant="outline" className="w-full mt-2" asChild>
                      <Link to={`/community?artist=${artist.id}`} className="flex items-center justify-center">
                        View Profile
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/community" className="flex items-center">
              Explore All Artists
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
};

export default ArtistShowcase;
