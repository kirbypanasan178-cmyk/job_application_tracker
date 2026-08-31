import {
  X,
  MapPin,
  Calendar,
  Briefcase,
  Home,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { StatusBadge } from "./StatusBadge";
import { CompanyAvatar } from "./CompanyAvatar";
import { useAppSelector } from "../../hooks/reduxHooks";

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  FullTime: "Full-time",
  PartTime: "Part-time",
  Contract: "Contract",
  Internship: "Internship",
  Freelance: "Freelance",
};

const WORK_SETUP_LABELS: Record<string, string> = {
  Onsite: "Onsite",
  Remote: "Remote",
  Hybrid: "Hybrid",
};

const formatDate = (value: string | null) => {
  if (!value) return "Not set";

  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

interface ApplicationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string | null;
}

export const ApplicationDetailsModal = ({
  isOpen,
  onClose,
  jobId,
}: ApplicationDetailsModalProps) => {
  const jobs = useAppSelector((state) => state.jobs.jobs);

  const job = jobs.items.find((j) => j._id === jobId);

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 p-6">
          <div className="flex items-center gap-3">
            <CompanyAvatar companyName={job.companyName} />

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {job.jobTitle}
              </h2>

              <p className="text-sm text-gray-500">
                {job.companyName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status + quick facts */}
        <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 px-6 py-4">
          <StatusBadge status={job.applicationStatus} />

          {/* Location */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            {job.location || "Not specified"}
          </div>

          {/* Employment Type */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Briefcase className="h-4 w-4" />
            {EMPLOYMENT_TYPE_LABELS[job.employmentType] ??
              job.employmentType}
          </div>

          {/* Work Setup */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Home className="h-4 w-4" />

            {job.workSetupType
              ? WORK_SETUP_LABELS[job.workSetupType] ??
                job.workSetupType
              : "Not specified"}
          </div>

          {/* Application Date */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            Applied {formatDate(job.applicationDate)}
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Description */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Description
            </h3>

            <p className="whitespace-pre-line text-sm text-gray-600">
              {job.description || "No description provided."}
            </p>
          </section>

          {/* Requirements */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Requirements
            </h3>

            <p className="whitespace-pre-line text-sm text-gray-600">
              {job.requirements || "No requirements provided."}
            </p>
          </section>

          {/* Skills */}
          <section>
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              {(job.skills || "")
                .split(",")
                .map((skill: string) => skill.trim())
                .filter(Boolean)
                .map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};