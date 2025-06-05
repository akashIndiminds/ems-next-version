import React from 'react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-blue-400 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 border-4 border-blue-300 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
      </div>
      <p className="mt-4 text-white text-lg">Loading...</p>
    </div>
  );
};

export default LoadingOverlay;