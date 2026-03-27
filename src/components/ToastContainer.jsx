import { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import useStore from '../store/useStore';

const toastStyles = {
  error: 'border-red-500/50 bg-red-900/40',
  success: 'border-emerald-500/50 bg-emerald-900/40',
  info: 'border-cyan-500/50 bg-cyan-900/40',
};

const toastIcons = {
  error: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => removeToast(toast.id), 5000);
      return () => clearTimeout(timer);
    });
  }, [toasts, removeToast]);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] space-y-2">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className={`glass border ${toastStyles[toast.type] || toastStyles.info} rounded-lg p-4 min-w-[300px] max-w-[400px] animate-slide-in`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-100">{toast.title}</div>
                <div className="text-xs text-slate-400 mt-0.5">{toast.message}</div>
              </div>
              <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}