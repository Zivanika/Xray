import { XRayExecution, XRayStep, Product, FilterConfig, FilterEvaluation } from './types';
import { generateMockCompetitors } from '@/data/mock-products';

// In-memory storage for executions
let executions: XRayExecution[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class XRay {
  id: string;
  steps: XRayStep[] = [];
  startTime: number;
  referenceProduct: Product;
  onStepComplete?: (step: XRayStep) => void;

  constructor(referenceProduct: Product, onStepComplete?: (step: XRayStep) => void) {
    this.id = `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.startTime = Date.now();
    this.referenceProduct = referenceProduct;
    this.onStepComplete = onStepComplete;
  }

  private logStep(stepData: Omit<XRayStep, 'timestamp'>) {
    const step: XRayStep = {
      ...stepData,
      timestamp: new Date().toISOString(),
    };
    this.steps.push(step);
    this.onStepComplete?.(step);
    return step;
  }

  async runPipeline(filters: FilterConfig): Promise<XRayExecution> {
    const stepStartTime = Date.now();

    // Step 1: Generate Keywords
    await delay(400);
    const keywords = this.generateKeywords();
    this.logStep({
      step: 'keyword_generation',
      input: { 
        title: this.referenceProduct.title, 
        category: this.referenceProduct.category 
      },
      output: keywords,
      reasoning: `Extracted core product terms from "${this.referenceProduct.title}". Focused on material (stainless steel, insulated), capacity (32oz), and brand category (water bottle). Added common synonyms and related search terms to maximize candidate pool.`,
      duration_ms: Date.now() - stepStartTime,
    });

    // Step 2: Search Candidates
    const searchStart = Date.now();
    await delay(500);
    const candidates = generateMockCompetitors(this.referenceProduct);
    this.logStep({
      step: 'candidate_search',
      input: { keywords, limit: 50 },
      output: candidates,
      reasoning: `Searched Amazon catalog using ${keywords.length} keywords. Retrieved ${candidates.length} potential competitors across multiple price points and quality tiers. Includes direct competitors, budget alternatives, and premium options.`,
      metadata: { 
        totalResults: 1247, 
        filteredToTop: 50,
        searchTime: '0.3s'
      },
      duration_ms: Date.now() - searchStart,
    });

    // Step 3: Apply Filters
    const filterStart = Date.now();
    await delay(600);
    const priceMin = this.referenceProduct.price * filters.priceMultiplierMin;
    const priceMax = this.referenceProduct.price * filters.priceMultiplierMax;
    
    const evaluations: FilterEvaluation[] = candidates.map(product => {
      const priceCheck = product.price >= priceMin && product.price <= priceMax;
      const ratingCheck = product.rating >= filters.minRating;
      const reviewsCheck = product.reviews >= filters.minReviews;
      const categoryCheck = product.category === 'Water Bottles';

      return {
        productId: product.asin,
        product,
        passed: priceCheck && ratingCheck && reviewsCheck && categoryCheck,
        checks: [
          {
            name: 'Price Range',
            passed: priceCheck,
            value: product.price,
            threshold: `$${priceMin.toFixed(2)} - $${priceMax.toFixed(2)}`,
            reason: priceCheck 
              ? `$${product.price.toFixed(2)} is within acceptable range`
              : product.price < priceMin 
                ? `$${product.price.toFixed(2)} is below minimum $${priceMin.toFixed(2)}`
                : `$${product.price.toFixed(2)} exceeds maximum $${priceMax.toFixed(2)}`
          },
          {
            name: 'Minimum Rating',
            passed: ratingCheck,
            value: product.rating,
            threshold: filters.minRating,
            reason: ratingCheck
              ? `${product.rating}★ meets minimum ${filters.minRating}★ requirement`
              : `${product.rating}★ is below minimum ${filters.minRating}★`
          },
          {
            name: 'Minimum Reviews',
            passed: reviewsCheck,
            value: product.reviews,
            threshold: filters.minReviews,
            reason: reviewsCheck
              ? `${product.reviews.toLocaleString()} reviews exceeds minimum ${filters.minReviews}`
              : `Only ${product.reviews.toLocaleString()} reviews, need at least ${filters.minReviews}`
          },
          {
            name: 'Category Match',
            passed: categoryCheck,
            value: product.category || 'Unknown',
            threshold: 'Water Bottles',
            reason: categoryCheck
              ? `Product is in the correct category`
              : `Product category "${product.category}" doesn't match target`
          }
        ]
      };
    });

    const passed = evaluations.filter(e => e.passed);
    const failed = evaluations.filter(e => !e.passed);

    this.logStep({
      step: 'apply_filters',
      input: { candidateCount: candidates.length },
      output: { 
        passedCount: passed.length, 
        failedCount: failed.length,
        passedProducts: passed.map(e => e.product)
      },
      evaluations,
      filters_applied: {
        priceMin,
        priceMax,
        minRating: filters.minRating,
        minReviews: filters.minReviews
      },
      reasoning: `Applied 4 filter criteria to ${candidates.length} candidates. ${passed.length} products passed all filters, ${failed.length} were eliminated. Most common failure reasons: price out of range (${evaluations.filter(e => !e.checks[0].passed).length}), insufficient reviews (${evaluations.filter(e => !e.checks[2].passed).length}), low rating (${evaluations.filter(e => !e.checks[1].passed).length}).`,
      duration_ms: Date.now() - filterStart,
    });

    // Step 4: Rank and Select Winner
    const rankStart = Date.now();
    await delay(200);
    
    const ranked = passed
      .map(e => ({
        product: e.product,
        score: this.calculateScore(e.product),
        breakdown: {
          reviewScore: Math.min(e.product.reviews / 50000, 1),
          ratingScore: (e.product.rating - 3.5) / 1.5,
          priceScore: 1 - Math.abs(e.product.price - this.referenceProduct.price) / this.referenceProduct.price
        }
      }))
      .sort((a, b) => b.score - a.score);

    const winner = ranked[0]?.product || null;

    this.logStep({
      step: 'rank_and_select',
      input: { qualifiedCandidates: passed.length },
      output: { 
        winner,
        topRanked: ranked.slice(0, 5)
      },
      reasoning: winner 
        ? `Selected "${winner.title}" as the top competitor. Scoring formula weights review count (40%), rating (35%), and price similarity (25%). This product scored ${ranked[0].score.toFixed(3)} with strong review volume (${winner.reviews.toLocaleString()}) and excellent rating (${winner.rating}★).`
        : 'No products passed all filter criteria. Consider relaxing filter thresholds.',
      metadata: {
        scoringWeights: { reviews: 0.4, rating: 0.35, price: 0.25 }
      },
      duration_ms: Date.now() - rankStart,
    });

    const execution: XRayExecution = {
      id: this.id,
      timestamp: new Date().toISOString(),
      reference_product: this.referenceProduct,
      final_output: winner,
      duration_ms: Date.now() - this.startTime,
      steps: this.steps,
      status: 'completed'
    };

    // Save to memory
    executions.unshift(execution);

    return execution;
  }

  private generateKeywords(): string[] {
    const title = this.referenceProduct.title.toLowerCase();
    const words = title.split(/\s+/);
    
    const keywords = [
      ...words.filter(w => w.length > 3),
      'water bottle',
      'insulated bottle',
      'stainless steel bottle',
      'vacuum insulated',
      'sport bottle',
      'hydration'
    ];

    return [...new Set(keywords)].slice(0, 10);
  }

  private calculateScore(product: Product): number {
    const reviewScore = Math.min(product.reviews / 50000, 1) * 0.4;
    const ratingScore = ((product.rating - 3.5) / 1.5) * 0.35;
    const priceScore = (1 - Math.abs(product.price - this.referenceProduct.price) / this.referenceProduct.price) * 0.25;
    
    return reviewScore + ratingScore + priceScore;
  }

  static getAll(): XRayExecution[] {
    return executions;
  }

  static getById(id: string): XRayExecution | null {
    return executions.find(e => e.id === id) || null;
  }

  static clear(): void {
    executions = [];
  }
}
