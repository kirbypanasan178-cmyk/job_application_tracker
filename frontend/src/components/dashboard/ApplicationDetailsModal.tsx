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
import type { JobApplicationResponse } from "../../types/JobApplication";

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
  job: JobApplicationResponse | null;
  isOpen: boolean;
  onClose: () => void;
}

interface FactProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Fact = ({ icon, children }: FactProps) => (
  <div className="flex items-center gap-1.5 text-sm text-slate-600">
    <span className="text-slate-400">{icon}</span>
    {children}
  </div>
);

interface SectionProps {
  label: string;
  children: React.ReactNode;
}

const Section = ({ label, children }: SectionProps) => (
  <section className="border-l-2 border-indigo-100 pl-4">
    <h3 className="mb-1.5 text-sm font-semibold text-slate-800">{label}</h3>
    {children}
  </section>
);

export const ApplicationDetailsModal = ({
  job,
  isOpen,
  onClose,
}: ApplicationDetailsModalProps) => {

  if (!job) return null;

  const skills = (job.skills || "")
    .split(",")
    .map((skill: string) => skill.trim())
    .filter(Boolean);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="relative from-indigo-50 via-indigo-50/40 to-white px-6 pb-5 pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-4 pr-8">
            <CompanyAvatar companyName={job.companyName} />

            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold text-slate-900">
                {job.jobTitle}
              </h2>
              <p className="text-sm text-slate-500">{job.companyName}</p>
            </div>
          </div>

          <div className="mt-4">
            <StatusBadge status={job.applicationStatus} />
          </div>
        </div>

        {/* Quick facts strip */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-slate-100 px-6 py-4">
          <Fact icon={<MapPin className="h-4 w-4" />}>
            {job.location || "Not specified"}
          </Fact>

          <span className="hidden h-4 w-px bg-slate-200 sm:block" />

          <Fact icon={<Briefcase className="h-4 w-4" />}>
            {EMPLOYMENT_TYPE_LABELS[job.employmentType] ?? job.employmentType}
          </Fact>

          <span className="hidden h-4 w-px bg-slate-200 sm:block" />

          <Fact icon={<Home className="h-4 w-4" />}>
            {job.workSetupType
              ? WORK_SETUP_LABELS[job.workSetupType] ?? job.workSetupType
              : "Not specified"}
          </Fact>

          <span className="hidden h-4 w-px bg-slate-200 sm:block" />

          <Fact icon={<Calendar className="h-4 w-4" />}>
            Applied {formatDate(job.applicationDate)}
          </Fact>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          <Section label="Description">
            {job.description ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {job.description}
              </p>
            ) : (
              <p className="text-sm italic text-slate-400">
                No description provided.
              </p>
            )}
          </Section>

          <Section label="Requirements">
            {job.requirements ? (
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {job.requirements}
              </p>
            ) : (
              <p className="text-sm italic text-slate-400">
                No requirements provided.
              </p>
            )}
          </Section>

          <Section label="Skills">
            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-slate-400">
                No skills listed.
              </p>
            )}
          </Section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/60 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};