export type ApplicationStatus =
  | "Interview"
  | "Technical Interview"
  | "Pending"
  | "Job Offer"
  | "Rejected"
  | "Withdrawn";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Interview: "bg-blue-50 text-blue-600",
  "Technical Interview": "bg-violet-50 text-violet-600",
  Pending: "bg-amber-50 text-amber-600",
  "Job Offer": "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-600",
  Withdrawn: "bg-gray-100 text-gray-500",
};

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <span
      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
};