'use client';

import { CrudPage } from '@/components/crud-page';
import { AttendanceForm } from '@/components/forms';
import type { Column } from '@/components/data-table';
import type { AttendanceEntity, StudentEntity, SessionEntity } from '@/lib/types';

const columns: Column<AttendanceEntity>[] = [
    {
        key: 'student_id',
        header: 'Student',
        render: (v) => {
            if (!v || typeof v === 'string') {
                return <span className="text-gray-400">{String(v) || '—'}</span>;
            }
            const student = v as StudentEntity;
            const name = typeof student.userId === 'object' ? student.userId.name : '';
            return (
                <div>
                    <span className="font-medium text-gray-900">{student.registration_number}</span>
                    {name && <span className="text-xs text-gray-500 block">{name}</span>}
                </div>
            );
        },
    },
    {
        key: 'session_id',
        header: 'Session',
        render: (v) => {
            if (!v || typeof v === 'string') {
                return <span className="text-gray-400">—</span>;
            }
            const session = v as SessionEntity;
            const date = new Date(session.date).toLocaleDateString();
            return <span className="text-xs text-gray-600">{date}</span>;
        },
    },
    {
        key: 'timestamp',
        header: 'Time',
        render: (v) => (
            <span className="text-xs text-gray-600">
                {new Date(v as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        ),
    },
    {
        key: 'status',
        header: 'Status',
        render: (v) => {
            const colors: Record<string, string> = {
                Present: 'bg-green-100 text-green-700',
                Late: 'bg-yellow-100 text-yellow-700',
                Absent: 'bg-red-100 text-red-700',
            };
            return (
                <span className={`text-xs px-2 py-0.5 rounded-full ${colors[v as string] || 'bg-gray-100 text-gray-600'}`}>
                    {v as string}
                </span>
            );
        },
    },
    {
        key: 'verification_method',
        header: 'Method',
        render: (v) => (
            <span className={`text-xs px-2 py-0.5 rounded-full ${v === 'Face' ? 'bg-primary-50 text-primary-700' : 'bg-orange-50 text-orange-700'
                }`}>
                {v === 'Face' ? 'Face' : 'QR'}
            </span>
        ),
    },
    {
        key: 'confidence_score',
        header: 'Confidence',
        render: (v) =>
            v != null ? (
                <span className="text-xs text-gray-600">{((v as number) * 100).toFixed(0)}%</span>
            ) : (
                <span className="text-gray-400">—</span>
            ),
    },
    {
        key: 'location_verified',
        header: 'Location',
        render: (v) => (
            <span className={`text-xs ${v ? 'text-green-600' : 'text-gray-400'}`}>
                {v ? '✓ Verified' : '—'}
            </span>
        ),
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

export default function AttendancePage() {
    return (
        <CrudPage<AttendanceEntity>
            endpoint="/attendance"
            columns={columns}
            title="Attendance"
            description="View and manage attendance records"
            entityLabel="Attendance Record"
            renderForm={(props) => <AttendanceForm {...props} />}
            wide
        />
    );
}
