import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  Code2,
  Link2,
  User,
  Zap,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { codingService } from '@/services/codingService';
import { CODING_PLATFORMS, CODING_PLATFORM_NAMES } from '@/constants';
import type { CodingPlatform, CodingProfile } from '@/types';

const schema = z.object({
  platform: z.enum(CODING_PLATFORM_NAMES),
  username: z.string().min(2, 'Username is required'),
  profileUrl: z.string().url('Enter a valid URL'),
});
type FormValues = z.infer<typeof schema>;

function platformMeta(name: CodingPlatform) {
  return CODING_PLATFORMS.find((p) => p.name === name);
}

export function CodingPage() {
  const crud = useCrud<CodingProfile>('coding', codingService, {
    itemName: 'Profile',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CodingProfile | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { platform: 'LeetCode', username: '', profileUrl: '' },
  });

  function openAdd() {
    setEditing(null);
    form.reset({ platform: 'LeetCode', username: '', profileUrl: '' });
    setDialogOpen(true);
  }

  function openEdit(profile: CodingProfile) {
    setEditing(profile);
    form.reset({
      platform: profile.platform,
      username: profile.username,
      profileUrl: profile.profileUrl,
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

  const connectedPlatforms = new Set(crud.items.map((p) => p.platform));
  const availableToAdd = CODING_PLATFORMS.filter(
    (p) => !connectedPlatforms.has(p.name),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Coding Profiles"
        description="Connect your competitive programming platform profiles."
        action={
          <Button onClick={openAdd} disabled={availableToAdd.length === 0}>
            <Plus className="mr-2 h-4 w-4" /> Connect Profile
          </Button>
        }
      />

      {crud.loading ? (
        <CardSkeletonGrid count={4} />
      ) : crud.error ? (
        <ErrorState message={crud.error.message} onRetry={() => crud.refetch()} />
      ) : crud.items.length === 0 ? (
        <EmptyState
          icon={<Code2 className="h-8 w-8" />}
          title="No coding profiles connected"
          description="Connect your LeetCode, Codeforces, and other platform profiles to keep everything in one place."
          actionLabel="Connect Your First Profile"
          onAction={openAdd}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {crud.items.map((profile) => {
            const meta = platformMeta(profile.platform);
            return (
              <Card
                key={profile._id}
                className="group flex flex-col gap-4 border-border/60 bg-card/40 p-5 transition-all hover:border-primary/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg"
                    style={{ backgroundColor: meta?.color }}
                  >
                    {profile.platform[0]}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold">
                      {profile.platform}
                    </h3>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <User className="h-3 w-3" /> {profile.username}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 truncate rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-muted-foreground">
                  <Link2 className="h-3 w-3 shrink-0" />
                  <span className="truncate">{profile.profileUrl}</span>
                </div>

                <div className="flex items-center gap-2 border-t border-border/60 pt-3">
                  <Button asChild variant="ghost" size="sm" className="flex-1">
                    <a href={profile.profileUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openEdit(profile)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(profile._id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Onboarding hint when no profiles and platforms available */}
      {crud.items.length === 0 && !crud.loading && (
        <Card className="border-border/60 bg-gradient-to-br from-primary/5 to-accent/10 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Supported platforms</p>
                <p className="text-xs text-muted-foreground">
                  LeetCode, Codeforces, HackerRank, GeeksforGeeks, CodeChef
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {CODING_PLATFORMS.map((p) => (
                <Badge key={p.name} variant="outline" className="font-normal">
                  {p.name}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass-strong sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Profile' : 'Connect Coding Profile'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the details below.' : 'Add a platform profile link.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!!editing}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(editing ? CODING_PLATFORMS : availableToAdd).map((p) => (
                          <SelectItem key={p.name} value={p.name}>
                            {p.name}
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
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="profileUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://leetcode.com/your_username" {...field} />
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
                  {editing ? 'Save changes' : 'Connect'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Disconnect profile?"
        description="This coding profile will be removed from your account."
        confirmLabel="Disconnect"
        loading={deleting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
