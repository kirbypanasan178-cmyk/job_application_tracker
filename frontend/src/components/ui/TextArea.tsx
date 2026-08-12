// components/ui/Textarea.tsx
import {type TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = "", ...rest }, ref) => (
    <textarea
      ref={ref}
      className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 ${
        error
          ? "border-red-400 focus:ring-red-200"
          : "border-slate-300 focus:border-slate-400 focus:ring-slate-200"
      } ${className}`}
      {...rest}
    />
  )
);
Textarea.displayName = "Textarea";