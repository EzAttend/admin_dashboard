'use client';

import { CrudPage } from '@/components/crud-page';
import { SessionForm } from '@/components/forms';
import type { Column } from '@/components/data-table';
import type { SessionEntity } from '@/lib/types';

const columns: Column<SessionEntity>[] = [
  {
    key: 'date',
    header: 'Date',
    render: (v) => (
      <span className="font-medium text-gray-900">
        {new Date(v as string).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: 'timetable_id',
    header: 'Timetable',
    render: (v) => {
      if (!v || typeof v === 'string') {
        return <span className="text-gray-400">—</span>;
      }
      const t = v as { class_id?: { class_name: string }; subject_id?: { subject_name: string }; day_of_week: string; start_time: string };
      const className = t.class_id?.class_name ?? '';
      const subjectName = t.subject_id?.subject_name ?? '';
      return (
        <span className="text-xs">
          {className} - {subjectName}
          <br />
          <span className="text-gray-500">{t.day_of_week} {t.start_time}</span>
        </span>
      );
    },
  },
  {
    key: 'is_active',
    header: 'Status',
    render: (v) => (
      <span
        className={`text-xs px-2 py-0.5 rounded-full ${
          v ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {v ? 'Active' : 'Inactive'}
      </span>
    ),
  },
  {
    key: 'start_time_actual',
    header: 'Actual Start',
    render: (v) =>
      v ? (
        <span className="text-xs text-gray-600">
          {new Date(v as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      ) : (
        <span className="text-gray-400">—</span>
      ),
  },
  {
    key: 'teacher_location_data',
    header: 'Location',
    render: (v) => {
      if (!v || typeof v !== 'object') {
        return <span className="text-gray-400">Not set</span>;
      }
      const loc = v as { lat: number; lng: number };
      return (
        <span className="text-xs text-gray-600">
          {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
        </span>
      );
    },
  },
  {
    key: 'createdAt',
    header: 'Created',
    render: (v) => (
      <span className="text-gray-500 text-xs">
        {new Date(v as string).toLocaleDateString()}
      </span>
    ),
  },
];

export default function SessionsPage() {
  return (
    <CrudPage<SessionEntity>
      endpoint="/sessions"
      columns={columns}
      title="Sessions"
      description="Manage class sessions for attendance tracking"
      entityLabel="Session"
      renderForm={(props) => <SessionForm {...props} />}
      wide
    />
  );
}
