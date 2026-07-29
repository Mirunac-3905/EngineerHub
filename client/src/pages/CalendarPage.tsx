import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CardSkeletonGrid,
  EmptyState,
  ErrorState,
} from '@/components/shared/StateViews';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useCrud } from '@/hooks/useCrud';
import { calendarService } from '@/services/calendarService';
import { EVENT_TYPE_OPTIONS, EVENT_TYPE_META } from '@/constants';
import type { CalendarEvent, EventType } from '@/types';
import { cn } from '@/lib/utils';
import { BookOpen, RefreshCw, Mic, Trophy, Circle, type LucideIcon } from 'lucide-react';

const EVENT_NAMES = EVENT_TYPE_OPTIONS as unknown as [EventType, ...EventType[]];

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  RefreshCw,
  Mic,
  Trophy,
  Circle,
};

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  type: z.enum(EVENT_NAMES),
  date: z.string().min(1, 'Pick a date'),
  time: z.string().min(1, 'Pick a time'),
  description: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function calendarGrid(month: Date) {
  const first = startOfMonth(month);
  const startDay = first.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(month.getFullYear(), month.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarPage() {
  const crud = useCrud<CalendarEvent>('calendar', calendarService, {
    itemName: 'Event',
  });
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      type: 'Study Session',
      date: new Date().toISOString().slice(0, 10),
      time: '18:00',
      description: '',
    },
  });

  function openAdd() {
    setEditing(null);
    form.reset({
      title: '',
      type: 'Study Session',
      date: new Date().toISOString().slice(0, 10),
      time: '18:00',
      description: '',
    });
    setDialogOpen(true);
  }

  function openEdit(event: CalendarEvent) {
    setEditing(event);
    form.reset({
      title: event.title,
      type: event.type,
      date: event.date,
      time: event.time,
      description: event.description,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: FormValues) {
    if (editing) {
      await crud.update(editing._id, values);
    } else {
      await crud.create(values);
    }
    setDialogOpen(false);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await crud.remove(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  const cells = useMemo(() => calendarGrid(cursor), [cursor]);
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of crud.items) {
      const arr = map.get(e.date) ?? [];
      arr.push(e);
      map.set(e.date, arr);
    }
    return map;
  }, [crud.items]);

  const upcoming = useMemo(
    () =>
      [...crud.items]
        .sort((a, b) => a.date.localeCompare(b.date))
        .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
        .slice(0, 5),
    [crud.items],
  );

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Study Planner"
        description="Schedule study sessions, revisions, interviews, and contests."
        action={
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Event
          </Button>
        }
      />

      {crud.loading ? (
        <CardSkeletonGrid count={4} />
      ) : crud.error ? (
        <ErrorState message={crud.error.message} onRetry={() => crud.refetch()} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Calendar grid */}
          <Card className="border-border/60 bg-card/40 p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">
                {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() - 1, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => setCursor(startOfMonth(new Date()))}
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + 1, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="pb-2 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {d}
                </div>
              ))}
              {cells.map((date, i) => {
                if (!date) return <div key={i} className="min-h-[64px] rounded-lg" />;
                const dateStr = date.toISOString().slice(0, 10);
                const dayEvents = eventsByDate.get(dateStr) ?? [];
                const isToday = dateStr === todayStr;
                return (
                  <div
                    key={i}
                    className={cn(
                      'min-h-[64px] rounded-lg border p-1.5 transition-colors',
                      isToday
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border/40 bg-background/30 hover:border-border',
                    )}
                  >
                    <p className={cn('text-xs', isToday ? 'font-semibold text-primary' : 'text-muted-foreground')}>
                      {date.getDate()}
                    </p>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 2).map((e) => {
                        const meta = EVENT_TYPE_META[e.type as EventType];
                        const Icon = ICON_MAP[meta.icon] ?? Circle;
                        return (
                          <div
                            key={e._id}
                            className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px]"
                            style={{ backgroundColor: `hsl(${meta.color} / 0.12)`, color: `hsl(${meta.color})` }}
                            title={e.title}
                          >
                            <Icon className="h-2.5 w-2.5 shrink-0" />
                            <span className="truncate">{e.title}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <p className="px-1 text-[10px] text-muted-foreground">
                          +{dayEvents.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Upcoming events */}
          <div className="space-y-4">
            <h2 className="font-display text-lg font-semibold">Upcoming</h2>
            {upcoming.length ? (
              <div className="space-y-3">
                {upcoming.map((event) => {
                  const meta = EVENT_TYPE_META[event.type as EventType];
                  const Icon = ICON_MAP[meta.icon] ?? Circle;
                  return (
                    <Card key={event._id} className="border-border/60 bg-card/40 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `hsl(${meta.color} / 0.12)`, color: `hsl(${meta.color})` }}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.type}</p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => openEdit(event)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(event._id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" />
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {event.time}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <EmptyState
                icon={<CalendarDays className="h-8 w-8" />}
                title="No events scheduled"
                description="Add study sessions, interviews, or contests to plan ahead."
                actionLabel="Add Event"
                onAction={openAdd}
                className="py-10"
              />
            )}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Event' : 'Add Event'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the event details.' : 'Plan a new study calendar event.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Graph Practice Set" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {EVENT_TYPE_OPTIONS.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={2} placeholder="Optional details" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={crud.creating || crud.updating}>
                  {editing ? 'Save changes' : 'Add event'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete event?"
        description="This event will be removed from your calendar."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
