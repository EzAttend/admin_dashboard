import { JOB_STATUS_INFO } from '@/lib/error-messages';

const STATUS_STYLES: Record<string, { bg: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  RUNNING: { bg: 'bg-primary-50 text-primary-700', dot: 'bg-primary-400 animate-pulse-soft' },
  COMPLETED: { bg: 'bg-success-50 text-success-700', dot: 'bg-success-500' },
  FAILED: { bg: 'bg-danger-50 text-danger-700', dot: 'bg-danger-500' },
  Active: { bg: 'bg-success-50 text-success-700', dot: 'bg-success-500' },
  Inactive: { bg: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  Pending: { bg: 'bg-amber-50 text-amber-700', dot: 'bg-amber-400' },
  Enrolled: { bg: 'bg-success-50 text-success-700', dot: 'bg-success-500' },
  Failed: { bg: 'bg-danger-50 text-danger-700', dot: 'bg-danger-500' },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? { bg: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
  const info = JOB_STATUS_INFO[status];
  const label = info?.label ?? status;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg}`}
      title={info?.description}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}
