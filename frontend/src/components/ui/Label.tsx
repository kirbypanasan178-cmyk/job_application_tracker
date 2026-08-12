// components/ui/Label.tsx
import type { LabelHTMLAttributes, ReactNode } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: ReactNode;
  required?: boolean;
  hint?: string;
}

export const Label = ({ children, required, hint, className = "", ...rest }: LabelProps) => (
  <label
    className={`mb-1.5 block text-sm font-medium text-slate-700 ${className}`}
    {...rest}
  >
    {children}
    {required && <span className="ml-0.5 text-red-500">*</span>}
    {hint && <span className="ml-1.5 font-normal text-slate-400">{hint}</span>}
  </label>
);