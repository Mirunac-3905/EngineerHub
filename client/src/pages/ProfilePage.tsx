import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { Loader2, User, GraduationCap, X, Plus } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { profileService } from '@/services/profileService';
import { COMMON_SKILLS } from '@/constants';
import { LoadingState, ErrorState } from '@/components/shared/StateViews';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useState } from 'react';
import type { Profile } from '@/types';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  college: z.string().min(2, 'College is required'),
  cgpa: z.coerce.number().min(0).max(10),
  github: z.string().url('Enter a valid URL').or(z.literal('')),
  linkedin: z.string().url('Enter a valid URL').or(z.literal('')),
  leetcode: z.string().url('Enter a valid URL').or(z.literal('')),
  codeforces: z.string().url('Enter a valid URL').or(z.literal('')),
  portfolio: z.string().url('Enter a valid URL').or(z.literal('')),
});
type FormValues = z.infer<typeof schema>;

export function ProfilePage() {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [skillInput, setSkillInput] = useState('');

  const { data: profile, isLoading, error, refetch } = useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: profileService.get,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Profile>) => profileService.update(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['profile'] });
      toast.success('Profile updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: profile
      ? {
          name: profile.name,
          college: profile.college,
          cgpa: profile.cgpa,
          github: profile.github,
          linkedin: profile.linkedin,
          leetcode: profile.leetcode,
          codeforces: profile.codeforces,
          portfolio: profile.portfolio,
        }
      : undefined,
  });

  const watchedSkills = profile?.skills ?? [];

  function addSkill() {
    const s = skillInput.trim();
    if (!s || !profile) return;
    if (profile.skills.includes(s)) return;
    updateMutation.mutate({ skills: [...profile.skills, s] });
    setSkillInput('');
  }

  function removeSkill(skill: string) {
    if (!profile) return;
    updateMutation.mutate({ skills: profile.skills.filter((s) => s !== skill) });
  }

  function onSubmit(values: FormValues) {
    updateMutation.mutate({ ...values, email: profile?.email });
  }

  const initials = (profile?.name ?? user?.name ?? 'U')
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (isLoading) return <LoadingState label="Loading profile…" />;
  if (error || !profile)
    return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal and academic information."
      />

      {/* Profile summary card */}
      <Card className="flex flex-col items-center gap-5 border-border/60 bg-gradient-to-br from-primary/5 to-accent/10 p-6 sm:flex-row sm:items-center">
        <Avatar className="h-20 w-20 border-2 border-primary/30">
          <AvatarFallback className="bg-gradient-to-br from-primary to-accent-foreground/70 text-xl font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="font-display text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
            <Badge variant="outline" className="font-normal">
              <GraduationCap className="mr-1 h-3 w-3" /> {profile.college}
            </Badge>
            <Badge variant="outline" className="font-normal">
              CGPA {profile.cgpa}
            </Badge>
          </div>
        </div>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-3">
          {/* Personal info */}
          <Card className="space-y-4 border-border/60 bg-card/40 p-6 lg:col-span-2">
            <h3 className="font-display text-base font-semibold">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="college"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>College</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cgpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGPA</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min={0} max={10} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="pt-2 font-display text-base font-semibold">Links</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="github"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="https://linkedin.com/in/…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leetcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LeetCode</FormLabel>
                    <FormControl>
                      <Input placeholder="https://leetcode.com/…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="codeforces"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codeforces</FormLabel>
                    <FormControl>
                      <Input placeholder="https://codeforces.com/…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolio"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Portfolio</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-portfolio.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end border-t border-border/60 pt-4">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </Card>

          {/* Skills */}
          <Card className="space-y-4 border-border/60 bg-card/40 p-6">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="font-display text-base font-semibold">Skills</h3>
            </div>
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add a skill"
              />
              <Button type="button" size="icon" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchedSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1 font-normal"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded-full hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {watchedSkills.length === 0 && (
                <p className="text-sm text-muted-foreground">No skills added yet.</p>
              )}
            </div>
            <div className="border-t border-border/60 pt-3">
              <p className="mb-2 text-xs text-muted-foreground">Suggestions</p>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILLS.filter((s) => !watchedSkills.includes(s))
                  .slice(0, 8)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateMutation.mutate({ skills: [...watchedSkills, s] })}
                      className="rounded-full border border-border/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      + {s}
                    </button>
                  ))}
              </div>
            </div>
          </Card>
        </form>
      </Form>
    </div>
  );
}
