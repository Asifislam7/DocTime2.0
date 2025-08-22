"use client";

import { useToast } from "@/components/ui/toast";

export function ToastDemo() {
  const { addToast, clearToasts } = useToast();

  const showSuccessToast = () => {
    addToast({
      type: 'success',
      title: 'Success! 🎉',
      message: 'This is a success message with some additional details.',
      duration: 5000,
    });
  };

  const showErrorToast = () => {
    addToast({
      type: 'error',
      title: 'Error! ❌',
      message: 'Something went wrong. Please try again.',
      duration: 8000,
      action: {
        label: 'Retry',
        onClick: () => console.log('Retry clicked'),
      },
    });
  };

  const showWarningToast = () => {
    addToast({
      type: 'warning',
      title: 'Warning! ⚠️',
      message: 'Please review your information before proceeding.',
      duration: 6000,
    });
  };

  const showInfoToast = () => {
    addToast({
      type: 'info',
      title: 'Information ℹ️',
      message: 'Here is some helpful information for you.',
      duration: 4000,
      action: {
        label: 'Learn More',
        onClick: () => console.log('Learn more clicked'),
      },
    });
  };

  const showPersistentToast = () => {
    addToast({
      type: 'info',
      title: 'Persistent Message',
      message: 'This toast will stay until you close it manually.',
      duration: 0, // 0 means no auto-remove
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4">Toast Notification Demo</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Success Toast
        </button>
        
        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Error Toast
        </button>
        
        <button
          onClick={showWarningToast}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Warning Toast
        </button>
        
        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Info Toast
        </button>
        
        <button
          onClick={showPersistentToast}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
        >
          Persistent Toast
        </button>
        
        <button
          onClick={clearToasts}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}
