"use client";

type ToastType = "success" | "error" | "info";

let toastListeners: Array<(message: string, type: ToastType) => void> = [];

export function showToast(message: string, type: ToastType = "info") {
  toastListeners.forEach((listener) => listener(message, type));
}

export function onToast(callback: (message: string, type: ToastType) => void) {
  toastListeners.push(callback);
  return () => {
    const index = toastListeners.indexOf(callback);
    if (index > -1) {
      toastListeners.splice(index, 1);
    }
  };
}

