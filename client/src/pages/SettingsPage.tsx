import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Moon, Sun, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { settingsService } from '@/services/settingsService';
import { useTheme } from '@/context/ThemeContext';
import { LoadingState, ErrorState } from '@/components/shared/StateViews';
import { toast } from 'sonner';
import type { Settings } from '@/types';

export function SettingsPage() {
  const qc = useQueryClient();
  const { theme, setTheme } = useTheme();

  const { data: settings, isLoading, error, refetch } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: settingsService.get,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Settings>) => settingsService.update(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
    onError: (e: Error) => toast.error(e.message),
  });

  // Keep persisted theme in sync with the server setting on first load.
  useEffect(() => {
    if (settings && settings.theme !== theme) {
      setTheme(settings.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  function toggleSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    updateMutation.mutate({ [key]: value });
  }

  function handleThemeChange(t: 'dark' | 'light') {
    setTheme(t);
    toggleSetting('theme', t);
  }

  if (isLoading) return <LoadingState label="Loading settings…" />;
  if (error || !settings)
    return <ErrorState message={error?.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your theme, password, and notifications." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Appearance */}
        <Card className="space-y-4 border-border/60 bg-card/40 p-6">
          <h3 className="font-display text-base font-semibold">Appearance</h3>
          <p className="text-sm text-muted-foreground">Choose how Engineer Hub looks to you.</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                theme === 'dark'
                  ? 'border-primary bg-primary/5'
                  : 'border-border/60 hover:border-border'
              }`}
            >
              <Moon className="h-6 w-6" />
              <span className="text-sm font-medium">Dark</span>
            </button>
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                theme === 'light'
                  ? 'border-primary bg-primary/5'
                  : 'border-border/60 hover:border-border'
              }`}
            >
              <Sun className="h-6 w-6" />
              <span className="text-sm font-medium">Light</span>
            </button>
          </div>
        </Card>

        {/* Password */}
        <Card className="space-y-4 border-border/60 bg-card/40 p-6">
          <h3 className="font-display text-base font-semibold">Change Password</h3>
          <p className="text-sm text-muted-foreground">
            Update your password to keep your account secure.
          </p>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="current">Current password</Label>
              <PasswordInput id="current" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new">New password</Label>
              <PasswordInput id="new" placeholder="••••••••" />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => toast.info('Connect the auth API to enable password changes.')}
            >
              Update password
            </Button>
          </div>
        </Card>
      </div>

      {updateMutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Saving…
        </div>
      )}
    </div>
  );
}
