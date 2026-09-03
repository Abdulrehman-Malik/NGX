import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-300",
  secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading = false, disabled, className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {isLoading ? "Please wait…" : children}
      </button>
    );
  },
);

Button.displayName = "Button";
