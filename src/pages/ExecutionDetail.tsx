import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { ProductCard } from '@/components/ProductCard';
import { StepCard } from '@/components/StepCard';
import { XRay } from '@/lib/xray';
import { XRayExecution } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Timer, Hash, CheckCircle2, XCircle } from 'lucide-react';

export default function ExecutionDetail() {
  const { executionId } = useParams<{ executionId: string }>();
  const [execution, setExecution] = useState<XRayExecution | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (executionId) {
      const data = XRay.getById(executionId);
      setExecution(data);
      setLoading(false);
    }
  }, [executionId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-16">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!execution) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-16">
          <h2 className="text-xl font-semibold text-foreground mb-2">Execution not found</h2>
          <p className="text-muted-foreground mb-4">
            The requested execution could not be found.
          </p>
          <Link to="/dashboard">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Back Button */}
        <Link to="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 p-6 rounded-xl border border-border bg-card">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Execution Details</h1>
              <Badge className={execution.final_output 
                ? "bg-success/20 text-success border-success/30" 
                : "bg-destructive/20 text-destructive border-destructive/30"
              }>
                {execution.status}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Hash className="w-4 h-4" />
                <span className="font-mono">{execution.id}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {new Date(execution.timestamp).toLocaleString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Timer className="w-4 h-4" />
                {execution.duration_ms}ms
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {execution.final_output ? (
              <div className="flex items-center gap-2 text-success">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Competitor Found</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-destructive">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">No Match</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Summary */}
        <div className="grid gap-6 md:grid-cols-2">
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
            <div className="flex items-center justify-center p-8 rounded-lg border border-border bg-card">
              <div className="text-center">
                <XCircle className="w-12 h-12 text-destructive/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No competitor matched the filter criteria</p>
              </div>
            </div>
          )}
        </div>

        {/* Pipeline Steps */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Pipeline Steps</h2>
          <div className="space-y-0">
            {execution.steps.map((step, index) => (
              <StepCard 
                key={step.timestamp} 
                step={step} 
                index={index}
                isLast={index === execution.steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
