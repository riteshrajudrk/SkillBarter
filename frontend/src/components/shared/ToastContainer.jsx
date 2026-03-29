import { useToastStore } from "../../store/toastStore.js";

const toastStyles = {
  success: "border-emerald-500/30 bg-emerald-500/12 text-emerald-100",
  error: "border-rose-500/30 bg-rose-500/12 text-rose-100",
  info: "border-slate-600 bg-slate-800 text-slate-100"
};

export default function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${toastStyles[toast.type] || toastStyles.info}`}
        >
          <div className="flex items-start justify-between gap-3">
            <p>{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-xs text-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
