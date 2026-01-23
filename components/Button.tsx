import React from 'react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-300 focus:outline-none focus:ring-4 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.96] rounded-xl";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/25 focus:ring-blue-500/20 border-none",
    secondary: "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-sm focus:ring-slate-100",
    outline: "border-2 border-slate-200 bg-transparent hover:border-blue-500 hover:text-blue-600 text-slate-600 focus:ring-blue-50",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-500 hover:text-slate-900",
  };
  
  const sizes = { 
    sm: "h-9 px-4 text-xs uppercase tracking-widest font-black", 
    md: "h-12 px-7 text-sm", 
    lg: "h-14 px-10 text-base" 
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      disabled={isLoading || disabled} 
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};