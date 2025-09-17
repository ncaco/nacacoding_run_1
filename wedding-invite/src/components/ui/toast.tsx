"use client";
import * as React from "react";
import { createPortal } from "react-dom";

type Toast = { id: number; message: string };

type ToastContextValue = {
  push: (message: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const idRef = React.useRef(0);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const push = (message: string) => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
  };

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      {mounted
        ? createPortal(
            <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center pointer-events-none" aria-live="polite" aria-atomic="true">
              <div className="space-y-2">
                {toasts.map((t) => (
                  <div key={t.id} className="pointer-events-auto rounded-md bg-black text-white/95 px-3 py-2 text-xs shadow-lg" role="status">
                    {t.message}
                  </div>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}


