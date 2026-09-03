import { LabelHTMLAttributes, ReactNode } from "react";

export function Label({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={`mb-1 block text-sm font-medium text-slate-700 ${className}`}
      {...props}
    />
  );
}

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
