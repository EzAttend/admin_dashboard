'use client';

import { CrudPage } from '@/components/crud-page';
import { ClassForm } from '@/components/forms';
import type { Column } from '@/components/data-table';
import type { ClassEntity } from '@/lib/types';

const columns: Column<ClassEntity>[] = [
  {
    key: 'class_name',
    header: 'Class Name',
    render: (v) => (
      <span className="font-medium text-gray-900">{String(v)}</span>
    ),
  },
  { key: 'batch', header: 'Batch' },
  {
    key: 'createdAt',
    header: 'Created',
    render: (v) => (
      <span className="text-gray-500 text-xs">{new Date(v as string).toLocaleDateString()}</span>
    ),
  },
];

export default function ClassesPage() {
  return (
    <CrudPage<ClassEntity>
      endpoint="/classes"
      columns={columns}
      title="Classes"
      description="Manage student classes and batches"
      entityLabel="Class"
      renderForm={(props) => <ClassForm {...props} />}
    />
  );
}
