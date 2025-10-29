'use client';

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRemoving(true);
      setTimeout(() => onRemove(toast.id), 300); // Wait for animation to complete
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className={`toast ${toast.type} ${isRemoving ? 'removing' : ''}`}>
      <div className="toast-message">{toast.message}</div>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const showSuccess = (message: string) => addToast(message, 'success');
  const showError = (message: string) => addToast(message, 'error');
  const showInfo = (message: string) => addToast(message, 'info');

  return {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showInfo,
  };
}
