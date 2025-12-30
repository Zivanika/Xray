import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Loader2, CheckCircle2, ArrowRight, Sparkles, Search, Filter, Trophy } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { referenceProducts } from '@/data/mock-products';
import { XRay } from '@/lib/xray';
import { Product, XRayStep, XRayExecution, FilterConfig } from '@/lib/types';
import { cn } from '@/lib/utils';

const stepInfo = [
  { key: 'keyword_generation', name: 'Keywords', icon: Sparkles },
  { key: 'candidate_search', name: 'Search', icon: Search },
  { key: 'apply_filters', name: 'Filter', icon: Filter },
  { key: 'rank_and_select', name: 'Select', icon: Trophy },
];

export default function Demo() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product>(referenceProducts[0]);
  const [filters, setFilters] = useState<FilterConfig>({
    priceMultiplierMin: 0.5,
    priceMultiplierMax: 2.0,
    minRating: 3.8,
    minReviews: 100,
  });
  const [isRunning, setIsRunning] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [execution, setExecution] = useState<XRayExecution | null>(null);

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setCompletedSteps([]);
    setCurrentStep(null);
    setExecution(null);

    const xray = new XRay(selectedProduct, (step: XRayStep) => {
      setCurrentStep(step.step);
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, step.step]);
      }, 100);
    });

    const result = await xray.runPipeline(filters);
    setExecution(result);
    setCurrentStep(null);
    setIsRunning(false);
  };

  const getStepStatus = (stepKey: string) => {
    if (completedSteps.includes(stepKey)) return 'completed';
    if (currentStep === stepKey) return 'running';
    return 'pending';
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Pipeline Demo</h1>
          <p className="text-muted-foreground">
            Configure and run a competitor analysis pipeline with full X-Ray visibility
          </p>
        </div>

        {/* Configuration Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Selection */}
          <div className="space-y-4 p-6 rounded-xl border border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground">Reference Product</h2>
            
            <div className="space-y-2">
              <Label htmlFor="product">Select Product</Label>
              <Select
                value={selectedProduct.asin}
                onValueChange={(value) => {
                  const product = referenceProducts.find(p => p.asin === value);
                  if (product) setSelectedProduct(product);
                }}
              >
                <SelectTrigger id="product">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {referenceProducts.map((product) => (
                    <SelectItem key={product.asin} value={product.asin}>
                      {product.title.slice(0, 40)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ProductCard product={selectedProduct} />
          </div>

          {/* Filter Configuration */}
          <div className="space-y-4 p-6 rounded-xl border border-border bg-card">
            <h2 className="text-lg font-semibold text-foreground">Filter Configuration</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Price Range (relative to ${selectedProduct.price.toFixed(2)})</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">Min Multiplier</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={filters.priceMultiplierMin}
                      onChange={(e) => setFilters({ ...filters, priceMultiplierMin: parseFloat(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      = ${(selectedProduct.price * filters.priceMultiplierMin).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Max Multiplier</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={filters.priceMultiplierMax}
                      onChange={(e) => setFilters({ ...filters, priceMultiplierMax: parseFloat(e.target.value) })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      = ${(selectedProduct.price * filters.priceMultiplierMax).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Minimum Rating</Label>
                  <span className="font-mono text-sm text-primary">{filters.minRating}★</span>
                </div>
                <Slider
                  value={[filters.minRating]}
                  onValueChange={([value]) => setFilters({ ...filters, minRating: value })}
                  min={1}
                  max={5}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minReviews">Minimum Reviews</Label>
                <Input
                  id="minReviews"
                  type="number"
                  value={filters.minReviews}
                  onChange={(e) => setFilters({ ...filters, minReviews: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Run Button & Progress */}
        <div className="space-y-6">
          <Button
            size="xl"
            onClick={handleRunPipeline}
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Running Pipeline...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Run Pipeline
              </>
            )}
          </Button>

          {/* Step Progress */}
          {(isRunning || completedSteps.length > 0) && (
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              {stepInfo.map((step, index) => {
                const status = getStepStatus(step.key);
                const Icon = step.icon;
                
                return (
                  <div key={step.key} className="flex items-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-full transition-all",
                        status === 'completed' && "bg-success/20 text-success",
                        status === 'running' && "bg-info/20 text-info animate-pulse",
                        status === 'pending' && "bg-muted text-muted-foreground"
                      )}>
                        {status === 'completed' ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : status === 'running' ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={cn(
                        "text-xs font-medium",
                        status === 'completed' && "text-success",
                        status === 'running' && "text-info",
                        status === 'pending' && "text-muted-foreground"
                      )}>
                        {step.name}
                      </span>
                    </div>
                    {index < stepInfo.length - 1 && (
                      <ArrowRight className={cn(
                        "w-5 h-5 mx-4",
                        completedSteps.includes(stepInfo[index + 1]?.key) || currentStep === stepInfo[index + 1]?.key
                          ? "text-success"
                          : "text-muted-foreground/30"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Summary */}
        {execution && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Pipeline Complete</h2>
              <span className="font-mono text-sm text-muted-foreground">
                {execution.duration_ms}ms total
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <ProductCard 
                product={execution.reference_product} 
                label="Reference Product" 
              />
              {execution.final_output ? (
                <ProductCard 
                  product={execution.final_output} 
                  variant="highlighted"
                  label="Selected Competitor" 
                />
              ) : (
                <div className="flex items-center justify-center p-8 rounded-lg border border-border bg-muted/50">
                  <p className="text-muted-foreground">No competitor found matching criteria</p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate(`/dashboard/${execution.id}`)}
            >
              View Full X-Ray Details
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
}
