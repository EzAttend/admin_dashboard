'use client';

import { CrudPage } from '@/components/crud-page';
import { TimetableForm } from '@/components/forms';
import type { Column } from '@/components/data-table';
import type { TimetableEntity } from '@/lib/types';

function refName(v: unknown, field: string): string {
  if (v && typeof v === 'object' && field in (v as Record<string, unknown>)) {
    return String((v as Record<string, string>)[field]);
  }
  return typeof v === 'string' ? v.slice(0, 8) + '…' : '—';
}

const DAY_COLORS: Record<string, string> = {
  Monday: 'bg-blue-50 text-blue-700',
  Tuesday: 'bg-purple-50 text-purple-700',
  Wednesday: 'bg-amber-50 text-amber-700',
  Thursday: 'bg-emerald-50 text-emerald-700',
  Friday: 'bg-rose-50 text-rose-700',
  Saturday: 'bg-gray-100 text-gray-600',
  Sunday: 'bg-gray-100 text-gray-600',
};

const columns: Column<TimetableEntity>[] = [
  {
    key: 'day_of_week',
    header: 'Day',
    render: (v) => {
      const day = String(v);
      const color = DAY_COLORS[day] ?? 'bg-gray-100 text-gray-600';
      return <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${color}`}>{day}</span>;
    },
  },
  {
    key: 'start_time',
    header: 'Start',
    render: (v) => <span className="font-mono text-sm text-gray-700">{String(v)}</span>,
  },
  {
    key: 'end_time',
    header: 'End',
    render: (v) => <span className="font-mono text-sm text-gray-700">{String(v)}</span>,
  },
  {
    key: 'class_id',
    header: 'Class',
    render: (v) => {
      const name = refName(v, 'class_name');
      return name === '—'
        ? <span className="text-gray-400">—</span>
        : <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{name}</span>;
    },
  },
  {
    key: 'teacher_id',
    header: 'Teacher',
    render: (v) => {
      if (v && typeof v === 'object') {
        const t = v as { userId?: string | { name: string } };
        if (t.userId && typeof t.userId === 'object' && 'name' in t.userId) {
          return <span className="font-medium text-gray-900">{t.userId.name}</span>;
        }
      }
      return <span className="text-gray-400">—</span>;
    },
  },
  {
    key: 'subject_id',
    header: 'Subject',
    render: (v) => {
      const code = refName(v, 'subject_code');
      return code === '—'
        ? <span className="text-gray-400">—</span>
        : <span className="font-mono text-sm font-medium">{code}</span>;
    },
  },
  {
    key: 'room_id',
    header: 'Room',
    render: (v) => {
      const num = refName(v, 'room_number');
      return num === '—'
        ? <span className="text-gray-400">—</span>
        : <span className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">{num}</span>;
    },
  },
];

export default function TimetablePage() {
  return (
    <CrudPage<TimetableEntity>
      endpoint="/timetable"
      columns={columns}
      title="Timetable"
      description="Manage weekly class schedules"
      entityLabel="Timetable Entry"
      wide
      renderForm={(props) => <TimetableForm {...props} />}
    />
  );
}
