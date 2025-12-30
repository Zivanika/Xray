import { Product } from '@/lib/types';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact' | 'highlighted';
  label?: string;
}

export function ProductCard({ product, variant = 'default', label }: ProductCardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card overflow-hidden transition-all",
      variant === 'highlighted' && "border-success/50 shadow-lg shadow-success/10",
      variant === 'compact' && "p-3"
    )}>
      {label && (
        <div className={cn(
          "px-4 py-2 text-xs font-semibold uppercase tracking-wider border-b",
          variant === 'highlighted' 
            ? "bg-success/10 text-success border-success/30" 
            : "bg-muted text-muted-foreground border-border"
        )}>
          {label}
        </div>
      )}
      <div className={cn(
        "p-4",
        variant === 'compact' && "p-0"
      )}>
        <h4 className={cn(
          "font-semibold text-foreground",
          variant === 'compact' ? "text-sm" : "text-base"
        )}>
          {product.title}
        </h4>
        
        <div className={cn(
          "flex items-center gap-4 text-muted-foreground",
          variant === 'compact' ? "mt-1 text-xs" : "mt-2 text-sm"
        )}>
          <span className="font-mono font-semibold text-success">
            ${product.price.toFixed(2)}
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-warning text-warning" />
            {product.rating}
          </span>
          <span>{product.reviews.toLocaleString()} reviews</span>
        </div>

        {product.category && variant !== 'compact' && (
          <p className="mt-2 text-xs text-muted-foreground">
            Category: {product.category}
          </p>
        )}

        {variant !== 'compact' && (
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            ASIN: {product.asin}
          </p>
        )}
      </div>
    </div>
  );
}
