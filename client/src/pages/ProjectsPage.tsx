import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  FolderGit2,
  Github,
  ExternalLink,
  Cpu,
} from 'lucide-react';
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
import { projectService } from '@/services/projectService';
import { PROJECT_STATUS_OPTIONS, PROJECT_STATUS_META } from '@/constants';
import type { Project, ProjectStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_NAMES = PROJECT_STATUS_OPTIONS as unknown as [ProjectStatus, ...ProjectStatus[]];

const schema = z.object({
  projectName: z.string().min(2, 'Project name is required'),
  description: z.string().min(5, 'Add a short description'),
  techStack: z.string().min(1, 'Add at least one technology'),
  githubLink: z.string().url('Enter a valid URL').or(z.literal('')),
  liveDemo: z.string().url('Enter a valid URL').or(z.literal('')),
  status: z.enum(STATUS_NAMES),
});
type FormValues = z.infer<typeof schema>;

export function ProjectsPage() {
  const crud = useCrud<Project>('projects', projectService, {
    itemName: 'Project',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      projectName: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveDemo: '',
      status: 'Planning',
    },
  });

  function openAdd() {
    setEditing(null);
    form.reset({
      projectName: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveDemo: '',
      status: 'Planning',
    });
    setDialogOpen(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    form.reset({
      projectName: project.projectName,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubLink: project.githubLink,
      liveDemo: project.liveDemo,
      status: project.status,
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: FormValues) {
    const techStack = values.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...values, techStack };
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Showcase the projects you build while preparing for placements."
        action={
          <Button onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
          </Button>
        }
      />

      {crud.loading ? (
        <CardSkeletonGrid count={4} />
      ) : crud.error ? (
        <ErrorState message={crud.error.message} onRetry={() => crud.refetch()} />
      ) : crud.items.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="h-8 w-8" />}
          title="No projects added yet"
          description="Add your first project to build a portfolio that impresses recruiters."
          actionLabel="Add Your First Project"
          onAction={openAdd}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crud.items.map((project) => {
            const meta = PROJECT_STATUS_META[project.status as ProjectStatus];
            return (
              <Card
                key={project._id}
                className="group flex flex-col gap-4 border-border/60 bg-card/40 p-5 transition-all hover:border-primary/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FolderGit2 className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold">
                      {project.projectName}
                    </h3>
                  </div>
                </div>

                <Badge variant="outline" className={cn('w-fit', meta.className)}>
                  <span className={cn('mr-1.5 h-1.5 w-1.5 rounded-full', meta.dot)} />
                  {project.status}
                </Badge>

                <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="font-normal">
                      <Cpu className="mr-1 h-2.5 w-2.5" /> {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2 border-t border-border/60 pt-3">
                  {project.githubLink && (
                    <Button asChild variant="ghost" size="sm" className="flex-1">
                      <a href={project.githubLink} target="_blank" rel="noreferrer">
                        <Github className="mr-1.5 h-3.5 w-3.5" /> Code
                      </a>
                    </Button>
                  )}
                  {project.liveDemo && (
                    <Button asChild variant="ghost" size="sm" className="flex-1">
                      <a href={project.liveDemo} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Demo
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(project)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(project._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the details below.' : 'Add a new project to your portfolio.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. DevNotes API" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="What does this project do?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="techStack"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technology stack</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Node.js, MongoDB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PROJECT_STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="githubLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub link</FormLabel>
                      <FormControl>
                        <Input placeholder="https://github.com/…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="liveDemo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Live demo</FormLabel>
                      <FormControl>
                        <Input placeholder="https://…" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={crud.creating || crud.updating}>
                  {editing ? 'Save changes' : 'Add project'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete project?"
        description="This project will be permanently removed from your portfolio."
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
