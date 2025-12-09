// Utility functions for form performance optimizations

/**
 * Smoothly scrolls to the first error field in the form
 */
export function scrollToFirstError(errors: Record<string, any>): void {
  if (typeof window === "undefined") return;
  
  const firstErrorField = Object.keys(errors)[0];
  if (!firstErrorField) return;

  // Try to find the input element by name or id
  const fieldName = firstErrorField.split(".")[0]; // Handle nested fields
  const input = document.querySelector(
    `[name="${fieldName}"], #${fieldName}, [id*="${fieldName}"]`
  ) as HTMLElement;

  if (input) {
    input.focus();
    input.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  } else {
    // Fallback: scroll to error summary if it exists
    const errorSummary = document.querySelector('[role="alert"]') as HTMLElement;
    if (errorSummary) {
      errorSummary.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
}

/**
 * Debounce function for form validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

