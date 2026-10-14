import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#572A39]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer uppercase tracking-wider text-xs';

  const variants = {
    primary:
      'bg-[#572A39] text-[#FAF7F2] hover:bg-[#431E2A] shadow-md hover:shadow-lg shadow-[#572A39]/20 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'border border-[#572A39] text-[#572A39] hover:bg-[#F2DDE1] hover:border-[#F2DDE1] hover:-translate-y-0.5 active:translate-y-0',
    champagne:
      'bg-[#D8BE9A] text-[#252124] hover:bg-[#C9B08B] shadow-sm hover:shadow shadow-[#D8BE9A]/30 hover:-translate-y-0.5 active:translate-y-0',
    rose:
      'bg-[#C98F9A] text-white hover:bg-[#B87B87] shadow-sm hover:shadow hover:-translate-y-0.5 active:translate-y-0',
    ghost:
      'text-[#572A39] hover:bg-[#F2DDE1]/60 normal-case tracking-normal',
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-sm active:translate-y-0',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[11px]',
    md: 'px-6 py-2.5 text-xs',
    lg: 'px-8 py-3.5 text-sm',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : Icon ? (
        <Icon className="w-4 h-4 mr-2" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
