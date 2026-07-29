import { type ReactNode } from 'react';
import { AlertTriangle, Inbox, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Professional empty state with an illustration slot and primary action.
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center gap-4 border-dashed bg-card/40 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
        {icon ?? <Inbox className="h-8 w-8" />}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-1">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}

// Inline error state for failed fetches.
export function ErrorState({
  message,
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center gap-4 border-destructive/30 bg-destructive/5 px-6 py-16 text-center',
        className,
      )}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-lg font-semibold">Something went wrong</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          {message ?? 'We could not load this data. Please try again.'}
        </p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Card>
  );
}

// Centered full-area loading indicator.
export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

// Skeleton grid for card-based lists.
export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative h-44 overflow-hidden rounded-xl border border-border bg-card/40"
        >
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-2/3 rounded bg-muted/60" />
            <div className="h-3 w-1/2 rounded bg-muted/40" />
            <div className="mt-4 h-20 rounded bg-muted/30" />
          </div>
        </div>
      ))}
    </div>
  );
}
