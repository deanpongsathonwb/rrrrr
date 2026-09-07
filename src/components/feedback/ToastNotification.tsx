import { useUiStore } from '@/src/stores/ui.store';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification = () => {
  const { toast, clearToast } = useUiStore();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      id="app-toast-container"
      className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short shadow-xl rounded-xl border bg-white p-4 flex items-start gap-3 transition-all duration-300"
    >
      <div className="mt-0.5 shrink-0">
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-600" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-600" />}
      </div>
      <div className="flex-1 text-sm text-slate-800 font-medium leading-relaxed">
        {toast.message}
      </div>
      <button
        id="btn-toast-close"
        onClick={clearToast}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
