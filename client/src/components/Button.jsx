import React from 'react';

const variantClasses = {
  primary: 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500',
  secondary: 'border border-white/20 bg-white/10 text-white hover:bg-white/20',
  dark: 'border border-zinc-800 bg-zinc-900 text-gray-300 hover:bg-zinc-800',
  light: 'bg-white text-black hover:bg-gray-100 shadow-lg shadow-white/5',
  link: 'bg-transparent px-0 py-0 text-indigo-400 hover:text-indigo-300 shadow-none',
};

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-sm rounded-2xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
};

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  fullWidth = false,
  disabled = false,
  startIcon = null,
  endIcon = null,
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70',
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        fullWidth ? 'w-full' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...props}
    >
      {startIcon}
      {children}
      {endIcon}
    </button>
  );
};

export default Button;
