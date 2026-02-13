'use client';

import { useState } from 'react';
import { Modal } from './modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch {
      // Error handled by caller
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="flex items-start gap-3 mb-6">
        {danger && (
          <div className="w-9 h-9 rounded-full bg-danger-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-danger-500" />
          </div>
        )}
        <p className="text-sm text-gray-600 pt-2">{message}</p>
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-50 ${
            danger
              ? 'bg-danger-500 hover:bg-danger-700'
              : 'bg-primary-600 hover:bg-primary-700'
          }`}
        >
          {loading ? 'Processing...' : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
