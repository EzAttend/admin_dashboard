'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  DoorOpen,
  Layers,
  Calendar,
  Upload,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Clock,
  CheckSquare,
} from 'lucide-react';
import { signOut, useSession } from '@/lib/auth-client';
import { useState, useEffect } from 'react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Setup',
    items: [
      { href: '/classes', label: 'Classes', icon: Layers },
      { href: '/subjects', label: 'Subjects', icon: BookOpen },
      { href: '/rooms', label: 'Rooms', icon: DoorOpen },
    ],
  },
  {
    title: 'People',
    items: [
      { href: '/students', label: 'Students', icon: GraduationCap },
      { href: '/teachers', label: 'Teachers', icon: Users },
    ],
  },
  {
    title: 'Schedule',
    items: [
      { href: '/timetable', label: 'Timetable', icon: Calendar },
    ],
  },
  {
    title: 'Attendance',
    items: [
      { href: '/sessions', label: 'Sessions', icon: Clock },
      { href: '/attendance', label: 'Records', icon: CheckSquare },
    ],
  },
  {
    title: 'Import',
    items: [
      { href: '/upload', label: 'CSV Upload', icon: Upload },
      { href: '/jobs', label: 'Import Jobs', icon: ClipboardList },
    ],
  },
];

/* ─── Layout Component ────────────────────────────────────────── */

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`);
    }
  }, [session, isPending, router, pathname]);

  // Show loading while checking auth
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect is happening)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Sidebar */}
      <aside
        className={`${collapsed ? 'w-17' : 'w-64'
          } bg-sidebar text-white flex flex-col transition-all duration-200 ease-in-out shrink-0`}
      >
        {/* Logo area */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            SA
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight truncate animate-slide-in">
              Smart Attendance
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/40 px-3 mb-2">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${isActive
                          ? 'bg-sidebar-active text-white font-medium'
                          : 'text-white/60 hover:bg-sidebar-hover hover:text-white/90'
                        }`}
                    >
                      <Icon className="w-4.5 h-4.5 shrink-0" />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sign Out */}
        <button
          onClick={async () => {
            await signOut();
            window.location.href = '/sign-in';
          }}
          className="flex items-center gap-3 px-4 py-3 text-sm text-white/50 hover:text-white/80 hover:bg-sidebar-hover transition-colors w-full"
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-12 border-t border-white/10 text-white/40 hover:text-white/70 transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
