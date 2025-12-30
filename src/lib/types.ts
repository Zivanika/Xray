export interface Product {
  asin: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  category?: string;
  imageUrl?: string;
}

export interface FilterEvaluation {
  productId: string;
  product: Product;
  passed: boolean;
  checks: {
    name: string;
    passed: boolean;
    value: string | number;
    threshold: string | number;
    reason: string;
  }[];
}

export interface XRayStep {
  step: string;
  timestamp: string;
  input?: any;
  output?: any;
  reasoning?: string;
  metadata?: any;
  evaluations?: FilterEvaluation[];
  filters_applied?: {
    priceMin: number;
    priceMax: number;
    minRating: number;
    minReviews: number;
  };
  duration_ms?: number;
}

export interface XRayExecution {
  id: string;
  timestamp: string;
  reference_product: Product;
  final_output: Product | null;
  duration_ms: number;
  steps: XRayStep[];
  status: 'completed' | 'running' | 'failed';
}

export interface FilterConfig {
  priceMultiplierMin: number;
  priceMultiplierMax: number;
  minRating: number;
  minReviews: number;
}
