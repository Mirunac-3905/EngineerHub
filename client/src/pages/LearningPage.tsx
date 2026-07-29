import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, GraduationCap, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { learningService } from '@/services/learningService';
import {
  CONFIDENCE_OPTIONS,
  DIFFICULTY_OPTIONS,
  STUDY_CATEGORIES,
} from '@/constants';
import type { Difficulty, Confidence, LearningTopic } from '@/types';
import { cn } from '@/lib/utils';

const DIFFICULTY_NAMES = DIFFICULTY_OPTIONS as unknown as [Difficulty, ...Difficulty[]];
const CONFIDENCE_NAMES = CONFIDENCE_OPTIONS as unknown as [Confidence, ...Confidence[]];

const DIFFICULTY_STYLE: Record<Difficulty, string> = {
  Beginner: 'bg-success/10 text-success border-success/30',
  Intermediate: 'bg-warning/10 text-warning border-warning/30',
  Advanced: 'bg-destructive/10 text-destructive border-destructive/30',
};
const CONFIDENCE_STYLE: Record<Confidence, string> = {
  Low: 'bg-destructive/10 text-destructive',
  Medium: 'bg-warning/10 text-warning',
  High: 'bg-success/10 text-success',
};

const schema = z.object({
  topicName: z.string().min(2, 'Topic name is required'),
  category: z.string().min(1, 'Select a category'),
  description: z.string().min(5, 'Add a short description'),
  difficulty: z.enum(DIFFICULTY_NAMES),
  progress: z.coerce.number().min(0).max(100),
  confidence: z.enum(CONFIDENCE_NAMES),
  targetDate: z.string().min(1, 'Pick a target date'),
});
type FormValues = z.infer<typeof schema>;

export function LearningPage() {
  const crud = useCrud<LearningTopic>('learning', learningService, {
    itemName: 'Topic',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LearningTopic | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // For quick inline progress updates we keep a separate mutation-free refetch.
  const {} = useQuery({ queryKey: ['learning'], queryFn: learningService.getAll });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      topicName: '',
      category: '',
      description: '',
      difficulty: 'Beginner',
      progress: 0,
      confidence: 'Low',
      targetDate: '',
    },
  });

  function openAdd() {
    setEditing(null);
    form.reset({
      topicName: '',
      category: '',
      description: '',
      difficulty: 'Beginner',
      progress: 0,
      confidence: 'Low',
      targetDate: '',
    });
    setDialogOpen(true);
  }

  function openEdit(topic: LearningTopic) {
    setEditing(topic);
    form.reset({
      topicName: topic.topicName,
      category: topic.category,
      description: topic.description,
      difficulty: topic.difficulty,
      progress: topic.progress,
      confidence: topic.confidence,
      targetDate: topic.targetDate,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: FormValues) {
    if (editing) {
      await crud.update(editing._id, { ...values, lastUpdated: new Date().toISOString() });
    } else {
      await crud.create({ ...values, lastUpdated: new Date().toISOString() });
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning Roadmap"
        description="Track daily progress across your placement topics."
        action={
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Topic
          </Button>
        }
      />

      {crud.loading ? (
        <CardSkeletonGrid count={6} />
      ) : crud.error ? (
        <ErrorState message={crud.error.message} onRetry={() => crud.refetch()} />
      ) : crud.items.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-8 w-8" />}
          title="No learning topics yet"
          description="Add your first topic to start tracking your preparation progress."
          actionLabel="Add Your First Topic"
          onAction={openAdd}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crud.items.map((topic) => (
            <Card
              key={topic._id}
              className="group flex flex-col gap-4 border-border/60 bg-card/40 p-5 transition-all hover:border-primary/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 space-y-1">
                  <h3 className="truncate font-display text-base font-semibold">
                    {topic.topicName}
                  </h3>
                  <p className="text-xs text-muted-foreground">{topic.category}</p>
                </div>
                <Badge variant="outline" className={cn('shrink-0', DIFFICULTY_STYLE[topic.difficulty])}>
                  {topic.difficulty}
                </Badge>
              </div>

              <p className="line-clamp-2 text-sm text-muted-foreground">
                {topic.description}
              </p>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{topic.progress}%</span>
                </div>
                <Progress value={topic.progress} className="h-1.5" />
              </div>

              <div className="flex items-center justify-between text-xs">
                <Badge variant="secondary" className={cn('font-normal', CONFIDENCE_STYLE[topic.confidence])}>
                  {topic.confidence} confidence
                </Badge>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" /> {topic.targetDate}
                </span>
              </div>

              <div className="flex items-center gap-2 border-t border-border/60 pt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEdit(topic)}
                >
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(topic._id)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Topic' : 'Add Learning Topic'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the details below.' : 'Track a new topic in your roadmap.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topicName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Dynamic Programming" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {STUDY_CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="difficulty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {DIFFICULTY_OPTIONS.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Textarea
                        rows={3}
                        placeholder="What does this topic cover?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress %</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} max={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confidence</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CONFIDENCE_OPTIONS.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="targetDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={crud.creating || crud.updating}>
                  {editing ? 'Save changes' : 'Add topic'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete topic?"
        description="This topic will be permanently removed from your roadmap."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
