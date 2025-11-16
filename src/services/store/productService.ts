
import { supabase } from '@/lib/supabase/client';

// Produto fictício para testes de UI
export interface Product {
  id: number;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  compareAtPrice?: number;
  categoryId: number;
  category?: string;
  images: string[];
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured?: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
  additionalInfo?: string;
  specifications?: Record<string, string>;
  reviews?: {
    average: number;
    count: number;
  };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Função para buscar todos os produtos
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // Em um ambiente real, isso seria uma chamada ao Supabase
    const MOCK_PRODUCTS: Product[] = [
      {
        id: 1,
        name: "JestFly Premium Headphones",
        description: "Premium wireless headphones with immersive sound experience",
        fullDescription: "Experience music like never before with our premium JestFly headphones. Featuring advanced noise cancellation, 40-hour battery life, and crystal clear sound quality that brings your music to life.",
        price: 129.99,
        compareAtPrice: 149.99,
        categoryId: 1,
        category: "Audio",
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          "https://images.unsplash.com/photo-1577174881658-0f30ed549adc",
          "https://images.unsplash.com/photo-1583394838336-acd977736f90"
        ],
        sizes: ["Standard"],
        colors: ["Black", "White", "Blue"],
        inStock: true,
        featured: true,
        onSale: true,
        freeShipping: true,
        additionalInfo: "Includes carrying case and 3.5mm audio cable",
        specifications: {
          "Battery Life": "40 hours",
          "Wireless Range": "30 feet",
          "Weight": "250g",
          "Connectivity": "Bluetooth 5.0",
          "Charging": "USB-C"
        },
        reviews: {
          average: 4.8,
          count: 124
        },
        tags: ["headphones", "wireless", "audio", "premium"],
        createdAt: "2023-06-15T10:00:00Z",
        updatedAt: "2023-06-15T10:00:00Z"
      },
      {
        id: 2,
        name: "JestFly Studio Monitor Speakers",
        description: "Professional studio monitor speakers for producers and DJs",
        fullDescription: "These studio-grade monitor speakers deliver accurate sound reproduction perfect for producing music or DJing. The balanced frequency response ensures you hear your mixes exactly as they are, with no coloration.",
        price: 299.99,
        categoryId: 1,
        category: "Audio",
        images: [
          "https://images.unsplash.com/photo-1545454675-3531b543be5d",
          "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3",
          "https://images.unsplash.com/photo-1578319439584-104c94d37305"
        ],
        sizes: ["5-inch", "8-inch"],
        colors: ["Black"],
        inStock: true,
        featured: false,
        freeShipping: true,
        specifications: {
          "Frequency Response": "45Hz-20kHz",
          "Power": "70W",
          "Inputs": "XLR, TRS, RCA",
          "Dimensions": "10.2 x 7.1 x 9.5 inches",
          "Weight": "5.8 kg"
        },
        reviews: {
          average: 4.6,
          count: 87
        },
        tags: ["speakers", "monitors", "studio", "production"],
        createdAt: "2023-05-20T10:00:00Z",
        updatedAt: "2023-05-20T10:00:00Z"
      },
      {
        id: 3,
        name: "JestFly Artist T-Shirt",
        description: "Limited edition artist collaboration t-shirt",
        fullDescription: "Show your support with this limited edition artist collaboration t-shirt. Features exclusive artwork from top JestFly artists printed on premium 100% cotton material for maximum comfort.",
        price: 29.99,
        categoryId: 2,
        category: "Apparel",
        images: [
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
          "https://images.unsplash.com/photo-1618354691373-d851c5c3a990",
          "https://images.unsplash.com/photo-1618354691438-25bc04584c23"
        ],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Black", "White", "Navy"],
        inStock: true,
        featured: false,
        onSale: false,
        additionalInfo: "Limited edition - only 500 made",
        specifications: {
          "Material": "100% Cotton",
          "Care": "Machine wash cold, tumble dry low",
          "Fit": "Unisex",
          "Shipping": "1-3 business days"
        },
        reviews: {
          average: 4.9,
          count: 42
        },
        tags: ["apparel", "t-shirt", "merchandise", "artist"],
        createdAt: "2023-07-05T10:00:00Z",
        updatedAt: "2023-07-05T10:00:00Z"
      },
      {
        id: 4,
        name: "JestFly Digital Audio Workstation",
        description: "Professional music production software",
        fullDescription: "Create, mix, and master your music with this professional-grade digital audio workstation. Includes thousands of samples, virtual instruments, and industry-standard plugins to take your productions to the next level.",
        price: 199.99,
        compareAtPrice: 249.99,
        categoryId: 3,
        category: "Software",
        images: [
          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04",
          "https://images.unsplash.com/photo-1594347970588-e7c83383a300"
        ],
        inStock: true,
        featured: true,
        onSale: true,
        additionalInfo: "Includes 12 months of free updates",
        specifications: {
          "System Requirements": "Windows 10 or macOS 10.15+",
          "RAM": "8GB minimum, 16GB recommended",
          "Storage": "20GB available space",
          "Processor": "Quad-core CPU",
          "License": "Single user, 2 machines"
        },
        reviews: {
          average: 4.7,
          count: 153
        },
        tags: ["software", "daw", "production", "digital"],
        createdAt: "2023-04-10T10:00:00Z",
        updatedAt: "2023-04-10T10:00:00Z"
      },
      {
        id: 5,
        name: "JestFly MIDI Controller",
        description: "25-key MIDI keyboard with drum pads and controls",
        fullDescription: "This compact MIDI controller features 25 velocity-sensitive keys, 8 drum pads, and programmable knobs perfect for producers on the go. USB-powered with seamless integration with all major DAWs.",
        price: 79.99,
        categoryId: 1,
        category: "Audio",
        images: [
          "https://images.unsplash.com/photo-1589903308904-1010c2294adc",
          "https://images.unsplash.com/photo-1598653222000-6b7b7a552625"
        ],
        inStock: true,
        featured: false,
        freeShipping: true,
        specifications: {
          "Keys": "25 velocity-sensitive mini keys",
          "Pads": "8 velocity-sensitive pads",
          "Controls": "8 knobs, pitch/mod wheels",
          "Connectivity": "USB-B",
          "Power": "USB bus-powered",
          "Weight": "1.8 lbs"
        },
        reviews: {
          average: 4.5,
          count: 76
        },
        tags: ["midi", "controller", "keyboard", "production"],
        createdAt: "2023-08-01T10:00:00Z",
        updatedAt: "2023-08-01T10:00:00Z"
      }
    ];

    return MOCK_PRODUCTS;
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    throw error;
  }
};

// Função para buscar um produto por ID
export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    // Em um ambiente real, isso seria uma chamada ao Supabase
    const products = await fetchProducts();
    const product = products.find(p => p.id === id);
    
    return product || null;
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error);
    throw error;
  }
};

// Função para buscar produtos por categoria
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    return products.filter(p => p.categoryId === categoryId);
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categoryId}:`, error);
    throw error;
  }
};

// Função para buscar produtos destacados
export const fetchFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    return products.filter(p => p.featured);
  } catch (error) {
    console.error('Erro ao buscar produtos destacados:', error);
    throw error;
  }
};

// Função para buscar produtos em promoção
export const fetchOnSaleProducts = async (): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    return products.filter(p => p.onSale);
  } catch (error) {
    console.error('Erro ao buscar produtos em promoção:', error);
    throw error;
  }
};

// Função para buscar produtos relacionados
export const fetchRelatedProducts = async (productId: number, categoryId: number): Promise<Product[]> => {
  try {
    const products = await fetchProducts();
    return products
      .filter(p => p.id !== productId && p.categoryId === categoryId)
      .slice(0, 4);
  } catch (error) {
    console.error(`Erro ao buscar produtos relacionados a ${productId}:`, error);
    throw error;
  }
};
