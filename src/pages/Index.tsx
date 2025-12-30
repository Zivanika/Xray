import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Play, LayoutDashboard, Search, Filter, Trophy, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Index() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-16 py-8">
        {/* Hero */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Pipeline Debugging Made Simple
          </div>
          
          <h1 className="text-5xl font-bold text-foreground tracking-tight">
            X-Ray Dashboard
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Visualize and debug multi-step algorithmic decision pipelines. 
            See exactly <span className="text-foreground font-medium">why</span> decisions were made, 
            not just <span className="text-foreground font-medium">what</span> happened.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/demo">
              <Button size="xl">
                <Play className="w-5 h-5" />
                Run Demo Pipeline
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="xl" variant="outline">
                <LayoutDashboard className="w-5 h-5" />
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center text-foreground">
            How It Works
          </h2>
          
          <div className="grid gap-6 md:grid-cols-4">
            {[
              { 
                icon: Sparkles, 
                title: 'Generate Keywords', 
                desc: 'Extract search terms from reference product',
                color: 'text-info'
              },
              { 
                icon: Search, 
                title: 'Find Candidates', 
                desc: 'Search for potential competitors',
                color: 'text-primary'
              },
              { 
                icon: Filter, 
                title: 'Apply Filters', 
                desc: 'Evaluate each product against criteria',
                color: 'text-warning'
              },
              { 
                icon: Trophy, 
                title: 'Rank & Select', 
                desc: 'Score and pick the best match',
                color: 'text-success'
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                  <div className={`p-3 rounded-lg bg-accent w-fit ${step.color}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{step.desc}</p>
                  </div>
                </div>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-muted-foreground/30 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center text-foreground">
            What You Get
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {[
              'Full visibility into every pipeline step',
              'See exactly why each filter passed or failed',
              'Compare products side-by-side',
              'Detailed scoring breakdowns',
              'Execution history and analytics',
              'Interactive filter exploration',
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
              >
                <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-8 rounded-2xl border border-border bg-card">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Ready to Debug Your Pipelines?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start with a demo execution to see X-Ray in action.
          </p>
          <Link to="/demo">
            <Button size="xl">
              <Play className="w-5 h-5" />
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
