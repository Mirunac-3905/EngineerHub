import { Link } from 'react-router-dom';
import { type ReactNode } from 'react';
import { Cpu, ArrowLeft } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '@/constants';

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Ambient accents */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[140px] animate-aurora" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-accent/20 blur-[140px] animate-aurora [animation-delay:6s]" />
      </div>

      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-card/30 p-12 backdrop-blur-xl lg:flex">
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />
        <Link to="/" className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-foreground/80 shadow-lg shadow-primary/20">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{APP_NAME}</p>
            <p className="text-xs text-muted-foreground">Placement Prep Platform</p>
          </div>
        </Link>

        <div className="relative space-y-6">
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight">
            Prepare smarter.
            <br />
            <span className="gradient-text">Land the offer.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            Track your learning roadmap, connect coding profiles, manage notes and
            projects, and research companies — all in one place.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              'Learning Roadmap',
              'Coding Profiles',
              'Notes & Projects',
              'Research Hub',
            ].map((f) => (
              <div
                key={f}
                className="rounded-lg border border-border/60 bg-card/40 px-3 py-2.5 text-xs font-medium text-muted-foreground"
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>

          <div className="space-y-2">
            <div className="flex items-center gap-2 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-foreground/80">
                <Cpu className="h-5 w-5 text-white" />
              </div>
              <span className="font-display text-base font-semibold">{APP_NAME}</span>
            </div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>

          {children}

          {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
