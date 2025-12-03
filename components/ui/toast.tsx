"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info";

export function Toast({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
}) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const bgColor =
    type === "success"
      ? "bg-green-500"
      : type === "error"
        ? "bg-red-500"
        : "bg-blue-500";

  return (
    <div
      className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center justify-between gap-4 min-w-[300px] max-w-md animate-in slide-in-from-top-5`}
    >
      <p className="font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:text-gray-200 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: Array<{ id: string; message: string; type: ToastType }> }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="animate-in slide-in-from-right-5">
          {/* Toast will be rendered by useToast hook */}
        </div>
      ))}
    </div>
  );
}

let toastIdCounter = 0;
const toastListeners: Array<(toasts: Array<{ id: string; message: string; type: ToastType }>) => void> = [];
let toastQueue: Array<{ id: string; message: string; type: ToastType }> = [];

function notifyToasts() {
  toastListeners.forEach((listener) => listener([...toastQueue]));
}

export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type: ToastType }>>([]);

  useEffect(() => {
    const listener = (newToasts: Array<{ id: string; message: string; type: ToastType }>) => {
      setToasts(newToasts);
    };
    toastListeners.push(listener);
    setToasts([...toastQueue]);

    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);

  const showToast = (message: string, type: ToastType = "info") => {
    const id = `toast-${++toastIdCounter}`;
    toastQueue.push({ id, message, type });
    notifyToasts();

    setTimeout(() => {
      toastQueue = toastQueue.filter((t) => t.id !== id);
      notifyToasts();
    }, 5000);
  };

  const removeToast = (id: string) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    notifyToasts();
  };

  return { toasts, showToast, removeToast };
}

