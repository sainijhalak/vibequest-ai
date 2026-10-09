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
  const baseStyles = 'inline-flex items-center justify-center font-display font-medium tracking-tight transition-all select-none disabled:opacity-40 disabled:pointer-events-none active:translate-y-[1px]';

  const variantStyles = {
    primary: 'bg-coral hover:bg-coral-hover text-ink-950 border border-coral-dark shadow-sm',
    secondary: 'bg-ink-850 hover:bg-ink-800 text-paper-50 border border-ink-700 hover:border-ink-600',
    outline: 'bg-transparent hover:bg-ink-900 text-paper-200 hover:text-paper-50 border border-ink-700 hover:border-ink-600',
    ghost: 'bg-transparent hover:bg-ink-850 text-paper-300 hover:text-paper-50',
    'coral-subtle': 'bg-coral-tint hover:bg-coral-tint/80 text-coral border border-coral/30 hover:border-coral/50',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5',
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
