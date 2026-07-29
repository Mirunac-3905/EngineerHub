import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, StickyNote, Pin, Search, Tag } from 'lucide-react';
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
  CardSkeletonGrid,
  EmptyState,
  ErrorState,
} from '@/components/shared/StateViews';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useCrud } from '@/hooks/useCrud';
import { notesService } from '@/services/notesService';
import type { Note } from '@/types';
import { cn } from '@/lib/utils';

const schema = z.object({
  title: z.string().min(2, 'Title is required'),
  content: z.string().min(5, 'Content is too short'),
  tags: z.string().optional(),
  pinned: z.boolean().default(false),
});
type FormValues = z.infer<typeof schema>;

export function NotesPage() {
  const crud = useCrud<Note>('notes', notesService, { itemName: 'Note' });
  const [query, setQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Note | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '', content: '', tags: '', pinned: false },
  });

  function openAdd() {
    setEditing(null);
    form.reset({ title: '', content: '', tags: '', pinned: false });
    setDialogOpen(true);
  }

  function openEdit(note: Note) {
    setEditing(note);
    form.reset({
      title: note.title,
      content: note.content,
      tags: note.tags.join(', '),
      pinned: note.pinned,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: FormValues) {
    const tags = (values.tags ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { title: values.title, content: values.content, tags, pinned: values.pinned };
    if (editing) {
      await crud.update(editing._id, payload);
    } else {
      await crud.create(payload);
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

  async function togglePin(note: Note) {
    await crud.update(note._id, { pinned: !note.pinned });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = q ? crud.items.filter((n) => n.title.toLowerCase().includes(q)) : crud.items;
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  }, [crud.items, query]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notes"
        description="Capture and organize your study notes and quick thoughts."
        action={
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Note
          </Button>
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes by title…"
          className="pl-9"
        />
      </div>

      {crud.loading ? (
        <CardSkeletonGrid count={6} />
      ) : crud.error ? (
        <ErrorState message={crud.error.message} onRetry={() => crud.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<StickyNote className="h-8 w-8" />}
          title={query ? 'No matching notes' : 'No notes yet'}
          description={
            query
              ? 'Try a different search term.'
              : 'Add your first note to start building your knowledge base.'
          }
          actionLabel={query ? undefined : 'Add Your First Note'}
          onAction={query ? undefined : openAdd}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((note) => (
            <Card
              key={note._id}
              className={cn(
                'group flex flex-col gap-3 border-border/60 bg-card/40 p-5 transition-all hover:border-primary/40',
                note.pinned && 'border-primary/40 bg-primary/5',
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-base font-semibold">{note.title}</h3>
                <button
                  onClick={() => togglePin(note)}
                  className={cn(
                    'shrink-0 rounded-md p-1 transition-colors',
                    note.pinned ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                  )}
                  title={note.pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin className={cn('h-4 w-4', note.pinned && 'fill-current')} />
                </button>
              </div>
              <p className="line-clamp-4 flex-1 text-sm text-muted-foreground">
                {note.content}
              </p>
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-normal">
                      <Tag className="mr-1 h-2.5 w-2.5" /> {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 border-t border-border/60 pt-3">
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => openEdit(note)}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(note._id)}
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Note' : 'Add Note'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the details below.' : 'Capture a quick study note.'}
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
                      <Input placeholder="e.g. Two Pointer Technique" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Write your note…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <Input placeholder="algorithms, arrays (comma separated)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pinned"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="h-4 w-4 rounded border-border accent-primary"
                      />
                      Pin this note to the top
                    </label>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={crud.creating || crud.updating}>
                  {editing ? 'Save changes' : 'Add note'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete note?"
        description="This note will be permanently removed."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
