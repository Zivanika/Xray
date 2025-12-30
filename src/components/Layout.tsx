import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Play, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Demo', href: '/demo', icon: Play },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
];

export function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">X-Ray</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Pipeline Debugger</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {children}
      </main>
    </div>
  );
}
