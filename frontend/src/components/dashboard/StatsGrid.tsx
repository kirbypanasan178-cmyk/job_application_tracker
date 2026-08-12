import {
  FileText,
  CalendarCheck,
  Clock,
  Users,
  Code2,
  Briefcase,
  XCircle,
  Undo2,
} from "lucide-react";
import StatCard, { type StatCardProps } from "./StatCard";

export interface DashboardStats {
  totalApplications: number;
  appliedToday: number;
  pending: number;
  interview: number;
  technicalInterview: number;
  jobOffer: number;
  rejected: number;
  withdrawn: number;
}

function getPercent(value: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

export default function StatsGrid({ stats }: { stats: DashboardStats }) {
  const total = stats.totalApplications;

  const cards: StatCardProps[] = [
    {
      icon: FileText,
      label: "Total Application",
      value: stats.totalApplications,
      subtitle: "All time",
      iconBgColor: "#EEF2FF",
      iconColor: "#6366F1",
    },
    {
      icon: CalendarCheck,
      label: "Applied Today",
      value: stats.appliedToday,
      subtitle: "Today",
      iconBgColor: "#ECFDF5",
      iconColor: "#10B981",
    },
    {
      icon: Clock,
      label: "Pending",
      value: stats.pending,
      subtitle: getPercent(stats.pending, total),
      iconBgColor: "#FFFBEB",
      iconColor: "#F59E0B",
    },
    {
      icon: Users,
      label: "Interview",
      value: stats.interview,
      subtitle: getPercent(stats.interview, total),
      iconBgColor: "#EFF6FF",
      iconColor: "#3B82F6",
    },
    {
      icon: Code2,
      label: "Technical Interview",
      value: stats.technicalInterview,
      subtitle: getPercent(stats.technicalInterview, total),
      iconBgColor: "#F5F3FF",
      iconColor: "#8B5CF6",
    },
    {
      icon: Briefcase,
      label: "Job Offer",
      value: stats.jobOffer,
      subtitle: getPercent(stats.jobOffer, total),
      iconBgColor: "#ECFDF5",
      iconColor: "#10B981",
    },
    {
      icon: XCircle,
      label: "Rejected",
      value: stats.rejected,
      subtitle: getPercent(stats.rejected, total),
      iconBgColor: "#FEF2F2",
      iconColor: "#EF4444",
    },
    {
      icon: Undo2,
      label: "Withdrawn",
      value: stats.withdrawn,
      subtitle: getPercent(stats.withdrawn, total),
      iconBgColor: "#F9FAFB",
      iconColor: "#6B7280",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}