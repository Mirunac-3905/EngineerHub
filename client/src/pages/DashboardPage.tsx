import { Link } from 'react-router-dom';
import {
  Code2,
  FolderGit2,
  GraduationCap,
  Quote,
  Search,
  StickyNote,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useRotating } from '@/hooks/useRotating';
import { learningService } from '@/services/learningService';
import {
  FEATURED_ENGINEERS,
  MOTIVATION_QUOTES,
  QUICK_ACTIONS,
} from '@/constants';
import { CardSkeletonGrid } from '@/components/shared/StateViews';
import { TodayTasks } from '@/components/TodayTasks';

const ACTION_ICONS: Record<string, LucideIcon> = {
  GraduationCap,
  Search,
  StickyNote,
  FolderGit2,
};

export function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const quote = useRotating(MOTIVATION_QUOTES, 9000);
  const engineer = useRotating(FEATURED_ENGINEERS, 12000);

  const { data: topics, isLoading } = useQuery({
    queryKey: ['learning'],
    queryFn: learningService.getAll,
  });

  const inProgress = topics?.filter((t) => t.progress > 0 && t.progress < 100) ?? [];
  const todaysGoal = inProgress[0];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-6 sm:p-8">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-background/50 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {greeting}, {firstName}.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Stay consistent. Every problem you solve today compounds into the
              offer you land tomorrow.
            </p>
          </div>
          {todaysGoal && (
            <div className="w-full max-w-xs space-y-2 rounded-xl border border-border/60 bg-background/40 p-4 backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Today&apos;s goal
              </p>
              <p className="text-sm font-medium">{todaysGoal.topicName}</p>
              <Progress value={todaysGoal.progress} className="h-1.5" />
              <p className="text-xs text-muted-foreground">{todaysGoal.progress}% complete</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_ACTIONS.map((a) => {
          const Icon = ACTION_ICONS[a.icon] ?? GraduationCap;
          return (
            <Link key={a.label} to={a.to}>
              <Card
                className={`group relative h-full overflow-hidden border-border/60 bg-gradient-to-br ${a.accent} p-5 transition-all hover:scale-[1.02] hover:border-primary/40`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-background/60 backdrop-blur">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="font-display text-sm font-semibold">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.description}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* In-progress learning */}
        <Card className="border-border/60 p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Continue learning</h2>
              <p className="text-xs text-muted-foreground">Pick up where you left off</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/learning">View all</Link>
            </Button>
          </div>
          {isLoading ? (
            <CardSkeletonGrid count={2} />
          ) : inProgress.length ? (
            <div className="space-y-3">
              {inProgress.slice(0, 3).map((t) => (
                <Link
                  key={t._id}
                  to="/learning"
                  className="flex items-center gap-4 rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.topicName}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.category}</p>
                  </div>
                  <div className="hidden w-28 sm:block">
                    <Progress value={t.progress} className="h-1.5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{t.progress}%</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No in-progress topics. Add one in Learning.
            </p>
          )}
        </Card>

        {/* Today's Tasks */}
        <TodayTasks />
      </div>

      {/* Motivation quote */}
      <Card className="relative flex flex-col justify-between overflow-hidden border-border/60 bg-gradient-to-br from-accent/10 to-card p-6">
        <Quote className="absolute right-4 top-4 h-16 w-16 text-accent-foreground/10" />
        <div className="relative space-y-3">
          <p className="font-display text-base font-medium leading-relaxed">
            &ldquo;{quote.quote}&rdquo;
          </p>
          <p className="text-xs text-muted-foreground">— {quote.author}</p>
        </div>
        <p className="relative mt-4 text-[11px] uppercase tracking-wider text-muted-foreground/70">
          Daily motivation
        </p>
      </Card>

      {/* Featured engineer */}
      <Card className="flex flex-col items-center gap-5 border-border/60 bg-card/40 p-6 text-center sm:flex-row sm:text-left">
        <Avatar className="h-20 w-20 border-2 border-primary/30">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent-foreground/70 text-lg font-semibold text-white">
            {engineer.name.split(' ').map((p) => p[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1.5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Featured engineer
          </p>
          <p className="font-display text-lg font-semibold">{engineer.name}</p>
          <p className="text-xs text-primary">{engineer.role}</p>
          <p className="max-w-2xl text-sm italic text-muted-foreground">
            &ldquo;{engineer.quote}&rdquo;
          </p>
        </div>
      </Card>
    </div>
  );
}
