import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { XRay } from '@/lib/xray';
import { XRayExecution } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight, Play, BarChart3, Timer, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [executions, setExecutions] = useState<XRayExecution[]>([]);

  useEffect(() => {
    setExecutions(XRay.getAll());
  }, []);

  const stats = {
    total: executions.length,
    avgDuration: executions.length > 0 
      ? Math.round(executions.reduce((sum, e) => sum + e.duration_ms, 0) / executions.length)
      : 0,
    successRate: executions.length > 0
      ? Math.round((executions.filter(e => e.final_output !== null).length / executions.length) * 100)
      : 0,
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              View and analyze past pipeline executions
            </p>
          </div>
          <Link to="/demo">
            <Button>
              <Play className="w-4 h-4" />
              Run New Pipeline
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Executions</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-info/10">
                <Timer className="w-6 h-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
                <p className="text-3xl font-bold text-foreground">{stats.avgDuration}ms</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-foreground">{stats.successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Executions Table */}
        {executions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-border bg-card">
            <div className="p-4 rounded-full bg-muted mb-4">
              <BarChart3 className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No executions yet</h3>
            <p className="text-muted-foreground mt-1 mb-4">
              Run your first pipeline to see results here
            </p>
            <Link to="/demo">
              <Button>
                <Play className="w-4 h-4" />
                Run Demo Pipeline
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Execution ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Timestamp
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Reference Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Result
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">
                    Duration
                  </th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {executions.map((execution) => (
                  <tr 
                    key={execution.id}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-foreground">
                        {execution.id.slice(0, 20)}...
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {new Date(execution.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-foreground truncate max-w-[200px]">
                        {execution.reference_product.title}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      {execution.final_output ? (
                        <Badge className="bg-success/20 text-success border-success/30">
                          Found
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                          No Match
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-sm text-muted-foreground">
                        {execution.duration_ms}ms
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Link to={`/dashboard/${execution.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
