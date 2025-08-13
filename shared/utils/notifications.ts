// Simple notification utility to replace alerts
// In a real app, you'd use a proper toast library like react-hot-toast or react-toastify

export const showNotification = {
  success: (message: string) => {
    // For now, we'll use alert but in a real app this would be a toast
    alert(`✅ ${message}`);
  },

  error: (message: string) => {
    alert(`❌ ${message}`);
  },

  warning: (message: string) => {
    alert(`⚠️ ${message}`);
  },

  info: (message: string) => {
    alert(`ℹ️ ${message}`);
  },
};

// Validation error display
export const showValidationErrors = (errors: string[]): void => {
  if (errors.length > 0) {
    const errorMessage = errors.join("\n");
    showNotification.error(
      `Please fix the following errors:\n\n${errorMessage}`
    );
  }
};
