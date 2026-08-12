// components/ui/ErrorLabel.tsx
interface ErrorLabelProps {
  message?: string;
}

export const ErrorLabel = ({ message }: ErrorLabelProps) => {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
};