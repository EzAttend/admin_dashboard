'use client';

import { useList } from '@/lib/hooks';
import Link from 'next/link';
import {
  Layers,
  BookOpen,
  DoorOpen,
  GraduationCap,
  Users,
  Calendar,
  Upload,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import type {
  ClassEntity,
  SubjectEntity,
  RoomEntity,
  StudentEntity,
  TeacherEntity,
  TimetableEntity,
} from '@/lib/types';

/* ─── Stat Card ───────────────────────────────────────────────── */

function StatCard({
  label,
  count,
  icon: Icon,
  href,
  color,
}: {
  label: string;
  count: number;
  icon: React.ElementType;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-surface-raised border border-border rounded-xl p-5 hover:border-border-hover hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold mt-1 text-gray-900">{count}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1 text-xs text-gray-400 group-hover:text-primary-600 transition-colors">
        <span>View all</span>
        <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  );
}

/* ─── Import Guide ────────────────────────────────────────────── */

const IMPORT_TIERS = [
  {
    tier: 1,
    title: 'Foundation Data',
    description: 'Create these first — they have no dependencies on other records.',
    entities: [
      { name: 'Classes', example: 'CSE-A, ECE-B', icon: Layers },
      { name: 'Subjects', example: 'CS101, MA201', icon: BookOpen },
      { name: 'Rooms', example: 'Room 101, Lab A', icon: DoorOpen },
    ],
    color: 'bg-primary-50 border-primary-200 text-primary-700',
    badge: 'bg-primary-100 text-primary-700',
  },
  {
    tier: 2,
    title: 'People',
    description: 'Students need a class, teachers need subjects. Set up Tier 1 first.',
    entities: [
      { name: 'Students', example: 'Name, email, class', icon: GraduationCap },
      { name: 'Teachers', example: 'Name, email, subjects', icon: Users },
    ],
    color: 'bg-warning-50 border-amber-200 text-warning-700',
    badge: 'bg-amber-100 text-warning-700',
  },
  {
    tier: 3,
    title: 'Schedule',
    description: 'Timetable entries reference classes, teachers, subjects, and rooms — create everything else first.',
    entities: [
      { name: 'Timetable', example: 'Class + Teacher + Room + Time', icon: Calendar },
    ],
    color: 'bg-success-50 border-emerald-200 text-success-700',
    badge: 'bg-emerald-100 text-success-700',
  },
];

/* ─── Dashboard Page ──────────────────────────────────────────── */

export default function DashboardPage() {
  const { data: classes, loading: l1 } = useList<ClassEntity>('/classes');
  const { data: subjects, loading: l2 } = useList<SubjectEntity>('/subjects');
  const { data: rooms, loading: l3 } = useList<RoomEntity>('/rooms');
  const { data: students, loading: l4 } = useList<StudentEntity>('/students');
  const { data: teachers, loading: l5 } = useList<TeacherEntity>('/teachers');
  const { data: timetable, loading: l6 } = useList<TimetableEntity>('/timetable');

  const loading = l1 || l2 || l3 || l4 || l5 || l6;

  const stats = [
    { label: 'Classes', count: classes.length, icon: Layers, href: '/classes', color: 'bg-primary-50 text-primary-600' },
    { label: 'Subjects', count: subjects.length, icon: BookOpen, href: '/subjects', color: 'bg-violet-50 text-violet-600' },
    { label: 'Rooms', count: rooms.length, icon: DoorOpen, href: '/rooms', color: 'bg-cyan-50 text-cyan-600' },
    { label: 'Students', count: students.length, icon: GraduationCap, href: '/students', color: 'bg-amber-50 text-amber-600' },
    { label: 'Teachers', count: teachers.length, icon: Users, href: '/teachers', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Timetable Entries', count: timetable.length, icon: Calendar, href: '/timetable', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your attendance management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            count={loading ? 0 : stat.count}
            icon={stat.icon}
            href={stat.href}
            color={stat.color}
          />
        ))}
      </div>

      {/* Import Order Guide */}
      <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center gap-2">
          <Info className="w-4 h-4 text-primary-500" />
          <h2 className="text-base font-semibold text-gray-900">
            CSV Import Order Guide
          </h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-6">
            When importing data via CSV, follow this order. Each tier depends on
            the ones above it being set up first.
          </p>
          <div className="space-y-4">
            {IMPORT_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className={`rounded-lg border p-4 ${tier.color}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tier.badge}`}>
                    Tier {tier.tier}
                  </span>
                  <h3 className="text-sm font-semibold">{tier.title}</h3>
                </div>
                <p className="text-xs opacity-80 mb-3">{tier.description}</p>
                <div className="flex flex-wrap gap-3">
                  {tier.entities.map((entity) => {
                    const EIcon = entity.icon;
                    return (
                      <div
                        key={entity.name}
                        className="flex items-center gap-2 bg-white/60 rounded-md px-3 py-1.5"
                      >
                        <EIcon className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium">{entity.name}</span>
                        <span className="text-[10px] opacity-60">({entity.example})</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/upload"
          className="flex items-center gap-4 bg-surface-raised border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
            <Upload className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Import CSV Data</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Bulk import students, teachers, or timetable entries
            </p>
          </div>
        </Link>
        <Link
          href="/jobs"
          className="flex items-center gap-4 bg-surface-raised border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-sm transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Import Jobs</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Track progress and review results of CSV imports
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
