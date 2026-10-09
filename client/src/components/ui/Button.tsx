import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'coral-subtle';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-display font-black tracking-tight transition-all select-none disabled:opacity-40 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 cursor-pointer';

  const variantStyles = {
    primary: 'bg-comic-green hover:bg-comic-yellow text-black border-3 border-black shadow-cartoon',
    secondary: 'bg-comic-yellow hover:bg-comic-orange text-black border-3 border-black shadow-cartoon',
    outline: 'bg-white hover:bg-comic-yellow text-black border-3 border-black shadow-cartoon',
    ghost: 'bg-transparent hover:bg-comic-yellow/30 text-black border-2 border-transparent',
    'coral-subtle': 'bg-comic-pink hover:bg-comic-orange text-white border-3 border-black shadow-cartoon',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-xl gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variantStyles[variant], sizeStyles[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      )}
      {children}
    </button>
  );
};
