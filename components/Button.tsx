
import React, { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-lg font-semibold text-white
                  bg-sky-600 hover:bg-sky-500 
                  focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-150 ease-in-out
                  shadow-md hover:shadow-lg
                  ${className}`}
    >
      {children}
    </button>
  );
};
