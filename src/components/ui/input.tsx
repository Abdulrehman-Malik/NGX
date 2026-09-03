import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-slate-300 focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
        } ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
