import { useQuery } from '@tanstack/react-query';
import {
  GraduationCap,
  StickyNote,
  FolderGit2,
  Code2,
  TrendingUp,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { analyticsService } from '@/services/analyticsService';
import { LoadingState, ErrorState } from '@/components/shared/StateViews';
import type { LucideIcon } from 'lucide-react';

const CARDS: { key: keyof import('@/types').AnalyticsSummary; label: string; icon: LucideIcon; accent: string }[] = [
  { key: 'topicsCompleted', label: 'Topics Completed', icon: GraduationCap, accent: 'from-blue-500/20 to-blue-500/5' },
  { key: 'totalNotes', label: 'Total Notes', icon: StickyNote, accent: 'from-emerald-500/20 to-emerald-500/5' },
  { key: 'projectsAdded', label: 'Projects Added', icon: FolderGit2, accent: 'from-amber-500/20 to-amber-500/5' },
  { key: 'connectedProfiles', label: 'Coding Profiles', icon: Code2, accent: 'from-purple-500/20 to-purple-500/5' },
];

export function AnalyticsPage() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getSummary,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="A quick snapshot of your placement prep activity."
      />

      {isLoading ? (
        <LoadingState label="Loading analytics…" />
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => refetch()} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((card) => {
              const value = data ? data[card.key] : 0;
              return (
                <Card
                  key={card.key}
                  className={`relative overflow-hidden border-border/60 bg-gradient-to-br ${card.accent} p-6`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background/60 backdrop-blur">
                      <card.icon className="h-5 w-5 text-foreground" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground/60" />
                  </div>
                  <p className="mt-5 font-display text-3xl font-semibold tracking-tight">
                    {value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{card.label}</p>
                </Card>
              );
            })}
          </div>

          <Card className="border-border/60 bg-card/40 p-6">
            <p className="text-sm text-muted-foreground">
              Keep adding topics, notes, and projects to grow your activity. Detailed
              charts and trends will appear here once your backend analytics endpoint
              is connected.
            </p>
          </Card>
        </>
      )}
    </div>
  );
}
