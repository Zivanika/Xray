import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, CheckCircle2, XCircle, Search, Filter, Trophy, Sparkles } from 'lucide-react';
import { XRayStep, FilterEvaluation } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StepCardProps {
  step: XRayStep;
  index: number;
  isLast?: boolean;
}

const stepIcons: Record<string, React.ReactNode> = {
  'keyword_generation': <Sparkles className="w-5 h-5" />,
  'candidate_search': <Search className="w-5 h-5" />,
  'apply_filters': <Filter className="w-5 h-5" />,
  'rank_and_select': <Trophy className="w-5 h-5" />,
};

const stepTitles: Record<string, string> = {
  'keyword_generation': 'Keyword Generation',
  'candidate_search': 'Candidate Search',
  'apply_filters': 'Apply Filters',
  'rank_and_select': 'Rank & Select Winner',
};

export function StepCard({ step, index, isLast }: StepCardProps) {
  const [isExpanded, setIsExpanded] = useState(index === 2); // Filter step open by default
  const [filterView, setFilterView] = useState<'all' | 'passed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getFilteredEvaluations = () => {
    if (!step.evaluations) return [];
    
    let filtered = step.evaluations;
    
    if (filterView === 'passed') {
      filtered = filtered.filter(e => e.passed);
    } else if (filterView === 'failed') {
      filtered = filtered.filter(e => !e.passed);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(e => 
        e.product.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };

  const passedCount = step.evaluations?.filter(e => e.passed).length || 0;
  const failedCount = step.evaluations?.filter(e => !e.passed).length || 0;

  return (
    <div className={cn(
      "relative animate-fade-in",
      !isLast && "pb-6"
    )} style={{ animationDelay: `${index * 100}ms` }}>
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />
      )}

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center gap-4 p-4 hover:bg-accent/50 transition-colors"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary shrink-0">
            {stepIcons[step.step] || <div className="w-5 h-5 rounded-full bg-primary" />}
          </div>
          
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">Step {index + 1}</span>
              {step.duration_ms && (
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {step.duration_ms}ms
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {stepTitles[step.step] || step.step}
            </h3>
          </div>

          {step.step === 'apply_filters' && (
            <div className="flex items-center gap-2">
              <Badge className="bg-success/20 text-success border-success/30">
                {passedCount} passed
              </Badge>
              <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                {failedCount} failed
              </Badge>
            </div>
          )}

          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          )}
        </button>

        {/* Content */}
        {isExpanded && (
          <div className="border-t border-border p-4 space-y-4">
            {/* Reasoning */}
            {step.reasoning && (
              <div className="p-4 rounded-lg bg-info/5 border border-info/20">
                <p className="text-sm text-foreground/90 leading-relaxed">
                  <span className="font-semibold text-info">Reasoning: </span>
                  {step.reasoning}
                </p>
              </div>
            )}

            {/* Input/Output for simple steps */}
            {step.step === 'keyword_generation' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Input</h4>
                  <div className="p-3 bg-muted/50 rounded-lg font-mono text-sm">
                    <p><span className="text-muted-foreground">title:</span> {step.input?.title}</p>
                    <p><span className="text-muted-foreground">category:</span> {step.input?.category}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Output Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {step.output?.map((keyword: string, i: number) => (
                      <Badge key={i} variant="secondary" className="font-mono">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Candidate Search Results */}
            {step.step === 'candidate_search' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-muted-foreground">
                    Found {step.output?.length || 0} Candidates
                  </h4>
                  <Badge variant="outline" className="font-mono text-xs">
                    {step.metadata?.searchTime}
                  </Badge>
                </div>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {step.output?.slice(0, 10).map((product: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
                      <span className="truncate flex-1">{product.title}</span>
                      <div className="flex items-center gap-3 ml-4 shrink-0">
                        <span className="text-success font-mono">${product.price?.toFixed(2)}</span>
                        <span className="text-warning">{product.rating}★</span>
                        <span className="text-muted-foreground">{product.reviews?.toLocaleString()} reviews</span>
                      </div>
                    </div>
                  ))}
                  {(step.output?.length || 0) > 10 && (
                    <div className="text-center text-sm text-muted-foreground py-2">
                      ... and {step.output.length - 10} more
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Filter Evaluations - THE IMPORTANT SECTION */}
            {step.step === 'apply_filters' && step.evaluations && (
              <div className="space-y-4">
                {/* Filter Config Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Price Range</p>
                    <p className="font-mono font-semibold">
                      ${step.filters_applied?.priceMin.toFixed(2)} - ${step.filters_applied?.priceMax.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Min Rating</p>
                    <p className="font-mono font-semibold">{step.filters_applied?.minRating}★</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Min Reviews</p>
                    <p className="font-mono font-semibold">{step.filters_applied?.minReviews?.toLocaleString()}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">Pass Rate</p>
                    <p className="font-mono font-semibold">
                      {((passedCount / step.evaluations.length) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant={filterView === 'all' ? 'secondary' : 'ghost'}
                      onClick={() => setFilterView('all')}
                    >
                      All ({step.evaluations.length})
                    </Button>
                    <Button
                      size="sm"
                      variant={filterView === 'passed' ? 'success' : 'ghost'}
                      onClick={() => setFilterView('passed')}
                    >
                      Passed ({passedCount})
                    </Button>
                    <Button
                      size="sm"
                      variant={filterView === 'failed' ? 'destructive' : 'ghost'}
                      onClick={() => setFilterView('failed')}
                    >
                      Failed ({failedCount})
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Input
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                {/* Evaluation Cards */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {getFilteredEvaluations().map((evaluation, i) => (
                    <EvaluationCard key={evaluation.productId} evaluation={evaluation} />
                  ))}
                </div>
              </div>
            )}

            {/* Rank & Select Results */}
            {step.step === 'rank_and_select' && step.output?.topRanked && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-muted-foreground">Top Ranked Products</h4>
                <div className="space-y-3">
                  {step.output.topRanked.map((item: any, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "p-4 rounded-lg border",
                        i === 0 
                          ? "bg-success/5 border-success/30" 
                          : "bg-muted/30 border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "flex items-center justify-center w-10 h-10 rounded-full shrink-0 text-lg font-bold",
                          i === 0 ? "bg-success/20 text-success" :
                          i === 1 ? "bg-muted text-muted-foreground" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-semibold">{item.product.title}</h5>
                            <Badge className={cn(
                              "font-mono",
                              i === 0 ? "bg-success text-success-foreground" : "bg-secondary"
                            )}>
                              Score: {item.score.toFixed(3)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>${item.product.price.toFixed(2)}</span>
                            <span>{item.product.rating}★</span>
                            <span>{item.product.reviews.toLocaleString()} reviews</span>
                          </div>
                          <div className="flex gap-4 mt-2 text-xs">
                            <span>Reviews: {(item.breakdown.reviewScore * 100).toFixed(0)}%</span>
                            <span>Rating: {(item.breakdown.ratingScore * 100).toFixed(0)}%</span>
                            <span>Price: {(item.breakdown.priceScore * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EvaluationCard({ evaluation }: { evaluation: FilterEvaluation }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={cn(
      "rounded-lg border overflow-hidden transition-all",
      evaluation.passed 
        ? "bg-success/5 border-success/20" 
        : "bg-destructive/5 border-destructive/20"
    )}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 hover:bg-accent/30 transition-colors"
      >
        {evaluation.passed ? (
          <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-destructive shrink-0" />
        )}
        <div className="flex-1 text-left">
          <p className="font-medium text-sm truncate">{evaluation.product.title}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
            <span>${evaluation.product.price.toFixed(2)}</span>
            <span>{evaluation.product.rating}★</span>
            <span>{evaluation.product.reviews.toLocaleString()} reviews</span>
          </div>
        </div>
        <Badge className={cn(
          "shrink-0",
          evaluation.passed 
            ? "bg-success/20 text-success border-success/30" 
            : "bg-destructive/20 text-destructive border-destructive/30"
        )}>
          {evaluation.passed ? 'PASSED' : 'FAILED'}
        </Badge>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-border/50 p-3 space-y-2">
          {evaluation.checks.map((check, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              {check.passed ? (
                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              )}
              <div>
                <span className={cn(
                  "font-medium",
                  check.passed ? "text-success" : "text-destructive"
                )}>
                  {check.name}:
                </span>
                <span className="text-muted-foreground ml-1">{check.reason}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
