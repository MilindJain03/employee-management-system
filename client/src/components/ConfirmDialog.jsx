import { useEffect, useRef } from 'react';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus trap
      const firstFocusable = dialogRef.current?.querySelector('button');
      firstFocusable?.focus();

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      ></div>

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-scale-in overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 id="dialog-title" className="text-xl font-bold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 text-white gradient-danger rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-300 font-semibold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
