import { type LucideIcon } from "lucide-react";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  subtitle: string;
  iconBgColor: string;
  iconColor: string;
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  iconBgColor,
  iconColor,
}: StatCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: iconBgColor }}
      >
        <Icon className="h-5 w-5" style={{ color: iconColor }} />
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="mt-0.5 text-2xl font-semibold text-gray-900">{value}</p>
        <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
      </div>
    </div>
  );
}