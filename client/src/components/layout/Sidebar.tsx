import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  Code2,
  FileText,
  FolderGit2,
  GraduationCap,
  LayoutDashboard,
  Search,
  Settings as SettingsIcon,
  StickyNote,
  UserCircle2,
  Cpu,
  type LucideIcon,
} from 'lucide-react';
import { NAV_GROUPS, APP_NAME } from '@/constants';
import { cn } from '@/lib/utils';

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  BarChart3,
  GraduationCap,
  Code2,
  StickyNote,
  FolderGit2,
  FileText,
  Search,
  CalendarDays,
  UserCircle2,
  Settings: SettingsIcon,
};

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <div className="flex items-center gap-2.5 px-2 pt-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent-foreground/80 shadow-lg shadow-primary/20">
          <Cpu className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <p className="font-display text-base font-semibold tracking-tight">
            {APP_NAME}
          </p>
          <p className="text-[11px] text-muted-foreground">Placement Prep</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto scrollbar-thin pr-1">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="space-y-1">
            <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
              {group.label}
            </p>
            {group.items.map((item) => {
              const Icon = ICONS[item.icon] ?? LayoutDashboard;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'h-4 w-4 shrink-0 transition-transform group-hover:scale-110',
                          isActive && 'text-primary',
                        )}
                      />
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </div>
  );
}

export { BookOpen };
