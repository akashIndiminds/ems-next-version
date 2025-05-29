import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  className = '',
  variant = 'primary',
}) => {
  const baseStyles = 'px-4 py-2 rounded-lg text-sm font-medium transition-colors';
  const variantStyles =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;