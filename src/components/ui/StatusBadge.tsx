import React from 'react';

type StatusType = 'Present' | 'Absent' | 'Half-day' | 'Leave';

interface StatusBadgeProps {
  status: StatusType | string; // Allow string for flexibility, but encourage StatusType
  size?: 'sm' | 'md' | 'lg'; // Optional size prop
  className?: string; // Allow custom classes for flexibility
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const statusStyles: Record<StatusType, string> = {
    Present: 'bg-green-100 text-green-800 border-green-300 ring-green-400/30',
    Absent: 'bg-red-100 text-red-800 border-red-300 ring-red-400/30',
    'Half-day': 'bg-yellow-100 text-yellow-800 border-yellow-300 ring-yellow-400/30',
    Leave: 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-400/30',
  };

  const sizeStyles: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const defaultStyle = 'bg-gray-100 text-gray-800 border-gray-300 ring-gray-400/30';
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-full border transition-all duration-200 ease-in-out';
  const style = statusStyles[status as StatusType] || defaultStyle;
  const sizeStyle = sizeStyles[size]; // TypeScript now knows size is 'sm' | 'md' | 'lg'

  return (
    <span
      className={`${baseStyle} ${style} ${sizeStyle} ${className}`}
      role="status"
      aria-label={`Status: ${status}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;