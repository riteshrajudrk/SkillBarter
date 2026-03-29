import { create } from "zustand";

let toastId = 1;

export const useToastStore = create((set) => ({
  toasts: [],
  showToast: (message, type = "error") => {
    const id = toastId;
    toastId += 1;

    set((state) => ({
      toasts: [...state.toasts, { id, message, type }]
    }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id)
      }));
    }, 3000);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  }
}));
