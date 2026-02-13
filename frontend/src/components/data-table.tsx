'use client';

import { useState, useMemo, useEffect } from 'react';
import { useList } from '@/lib/hooks';
import { humanizeApiError } from '@/lib/error-messages';
import {
  Pencil,
  Trash2,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
  Inbox,
} from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: unknown, row: T) => React.ReactNode;
  searchable?: boolean;
}

interface DataTableProps<T extends { _id: string }> {
  endpoint: string;
  columns: Column<T>[];
  title: string;
  description?: string;
  emptyMessage?: string;
  emptyIcon?: React.ElementType;
  onCreate?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  /** Increment to trigger a data refetch */
  refreshKey?: number;
}

export function DataTable<T extends { _id: string }>({
  endpoint,
  columns,
  title,
  description,
  emptyMessage = 'No records found.',
  emptyIcon: EmptyIcon = Inbox,
  onCreate,
  onEdit,
  onDelete,
  refreshKey,
}: DataTableProps<T>) {
  const { data, loading, error, refetch } = useList<T>(endpoint);
  const [search, setSearch] = useState('');

  // Refetch data when refreshKey changes (e.g. after mutation)
  useEffect(() => {
    if (refreshKey) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const hasActions = Boolean(onEdit || onDelete);

  // Filter data by search query across searchable columns
  const filtered = useMemo(() => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        if (col.searchable === false) return false;
        const val = (row as Record<string, unknown>)[String(col.key)];
        if (val == null) return false;
        if (typeof val === 'object') {
          return JSON.stringify(val).toLowerCase().includes(q);
        }
        return String(val).toLowerCase().includes(q);
      }),
    );
  }, [data, search, columns]);

  /* ── Loading state ──────────────────────────────────────────── */

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title={title} description={description} count={null} />
        <div className="bg-surface-raised border border-border rounded-xl p-12 flex flex-col items-center gap-3 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <p className="text-sm">Loading records...</p>
        </div>
      </div>
    );
  }

  /* ── Error state ────────────────────────────────────────────── */

  if (error) {
    return (
      <div className="animate-fade-in">
        <PageHeader title={title} description={description} count={null} />
        <div className="bg-danger-50 border border-red-200 rounded-xl p-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-danger-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-danger-700">Failed to load data</p>
            <p className="text-sm text-danger-700/70 mt-1">{humanizeApiError(error)}</p>
            <button
              onClick={refetch}
              className="mt-3 text-sm font-medium text-danger-700 underline underline-offset-2 hover:text-danger-500 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Normal state ───────────────────────────────────────────── */

  return (
    <div className="animate-fade-in space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title={title} description={description} count={data.length} />
        <div className="flex items-center gap-2">
          {onCreate && (
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 active:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create
            </button>
          )}
        </div>
      </div>

      {/* Search + Table */}
      <div className="bg-surface-raised border border-border rounded-xl overflow-hidden">
        {/* Search bar */}
        {data.length > 0 && (
          <div className="px-4 py-3 border-b border-border">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search records..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all bg-white"
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {data.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <EmptyIcon className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">{emptyMessage}</p>
            {onCreate && (
              <button
                onClick={onCreate}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create your first record
              </button>
            )}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 flex flex-col items-center text-center">
            <Search className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">
              No results for &ldquo;{search}&rdquo;
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-sm text-primary-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          /* Table */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-gray-50/50">
                  {columns.map((col, colIdx) => (
                    <th
                      key={colIdx}
                      className="text-left px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap"
                    >
                      {col.header}
                    </th>
                  ))}
                  {hasActions && (
                    <th className="text-right px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap w-24">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((row) => (
                  <tr
                    key={row._id}
                    className="table-row-hover transition-colors"
                  >
                    {columns.map((col, colIdx) => {
                      const value = (row as Record<string, unknown>)[String(col.key)];
                      return (
                        <td key={colIdx} className="px-4 py-3 whitespace-nowrap text-gray-700">
                          {col.render ? col.render(value, row) : String(value ?? '—')}
                        </td>
                      );
                    })}
                    {hasActions && (
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(row)}
                              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(row)}
                              className="p-1.5 rounded-md hover:bg-danger-50 text-gray-400 hover:text-danger-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer with count */}
        {filtered.length > 0 && (
          <div className="px-4 py-2.5 border-t border-border bg-gray-50/30 text-xs text-gray-400">
            Showing {filtered.length} of {data.length} record{data.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shared header sub-component ──────────────────────────────── */

function PageHeader({
  title,
  description,
  count,
}: {
  title: string;
  description?: string;
  count: number | null;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {count !== null && (
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      )}
    </div>
  );
}
