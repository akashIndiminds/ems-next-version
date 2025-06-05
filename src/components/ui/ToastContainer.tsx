import React from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg transform transition-transform duration-300 ease-in-out ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
          } text-white flex items-center justify-between animate-slide-in`}
        >
          <div className="flex items-center">
            {toast.type === 'success' && <i className="fas fa-check-circle mr-2"></i>}
            {toast.type === 'error' && <i className="fas fa-exclamation-circle mr-2"></i>}
            {toast.type === 'info' && <i className="fas fa-info-circle mr-2"></i>}
            <p>{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="ml-4 text-white">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;