
import { 
  getProducts, 
  getProductById, 
  getFeaturedProducts, 
  getProductCategories 
} from './services/productQueryService';

import { 
  getRelatedProducts 
} from './services/relatedProductsService';

import { 
  getProductRatings, 
  rateProduct, 
  submitProductRating 
} from './services/productRatingService';

import { 
  getDigitalProductDetails, 
  registerDigitalProductDownload 
} from './services/digitalProductService';

// Re-export all functions to maintain the same API
export {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductCategories,
  getRelatedProducts,
  getProductRatings,
  rateProduct,
  submitProductRating,
  getDigitalProductDetails,
  registerDigitalProductDownload
};
