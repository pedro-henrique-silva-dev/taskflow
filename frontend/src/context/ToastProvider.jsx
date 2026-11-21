import { useCallback, useMemo, useRef, useState } from 'react';
import ToastContainer from '../components/ui/ToastContainer.jsx';
import { ToastContext } from './ToastContext.js';

const TOAST_DURATION_MS = 3500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      nextId.current += 1;
      const id = nextId.current;
      setToasts((current) => [...current, { id, message, type }]);
      setTimeout(() => dismissToast(id), TOAST_DURATION_MS);
    },
    [dismissToast],
  );

  const value = useMemo(
    () => ({
      success: (message) => showToast(message, 'success'),
      error: (message) => showToast(message, 'error'),
    }),
    [showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}
