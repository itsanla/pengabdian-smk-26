import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500 ${className}`}
      {...props}
    />
  );
}