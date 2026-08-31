import { useState, type FormEvent, type ChangeEvent } from "react";
import { Label } from "../../components/ui/Label";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/TextArea";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { ErrorLabel } from "../../components/ui/ErrorLabel";
import { validateJobApplicationForm } from "../../validator/JobApplicationForm";
import type { JobApplicationFormType } from "../../types/JobApplication";

const EMPTY_FORM: JobApplicationFormType = {
  jobTitle: "",
  companyName: "",
  location: "",
  salaryMin: 0,
  salaryMax: 0,
  jobUrl: "",
  description: "",
  requirements: "",
  skills: "",
  employmentType: "FullTime",
  workSetupType: "Onsite",
};

const EMPLOYMENT_TYPE_OPTIONS = [
  { label: "Full-time", value: "FullTime" },
  { label: "Part-time", value: "PartTime" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
  { label: "Freelance", value: "Freelance" },
];

const WORK_SETUP_TYPE_OPTIONS = [
  { label: "Onsite", value: "Onsite" },
  { label: "Remote", value: "Remote" },
  { label: "Hybrid", value: "Hybrid" },
];

interface JobApplicationFormProps {
  onSubmit: (data: JobApplicationFormType) => void | Promise<void>;
  onCancel?: () => void;
  initialValues?: Partial<JobApplicationFormType>;
  isLoading?: boolean;
}

export const JobApplicationForm = ({
  onSubmit,
  onCancel,
  initialValues,
  isLoading = false,
}: JobApplicationFormProps) => {
  const [formData, setFormData] = useState<JobApplicationFormType>({
    ...EMPTY_FORM,
    ...initialValues,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof JobApplicationFormType, string>>>({});

  const NUMERIC_FIELDS = new Set(["salaryMin", "salaryMax"]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: NUMERIC_FIELDS.has(name) ? Number(value) : value,
    }));
    if (errors[name as keyof JobApplicationFormType]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateJobApplicationForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Post a job</h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill in the details below to create a new job listing.
          </p>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="jobTitle" required>
            Job title
          </Label>
          <Input
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            placeholder="e.g. Frontend Developer"
            error={errors.jobTitle}
          />
          <ErrorLabel message={errors.jobTitle} />
        </div>

        <div>
          <Label htmlFor="companyName" required>
            Company name
          </Label>
          <Input
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="e.g. Acme Corp"
            error={errors.companyName}
          />
          <ErrorLabel message={errors.companyName} />
        </div>

        <div>
          <Label htmlFor="location" required>
            Location
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Davao City, PH"
            error={errors.location}
          />
          <ErrorLabel message={errors.location} />
        </div>

        <div />

        <div>
          <Label htmlFor="salaryMin">
            Minimum salary (monthly)
          </Label>
          <Input
            id="salaryMin"
            name="salaryMin"
            type="number"
            min={0}
            value={formData.salaryMin || ""}
            onChange={handleChange}
            placeholder="e.g. 35000"
            error={errors.salaryMin}
          />
          <ErrorLabel message={errors.salaryMin} />
        </div>

        <div>
          <Label htmlFor="salaryMax">
            Maximum salary (monthly)
          </Label>
          <Input
            id="salaryMax"
            name="salaryMax"
            type="number"
            min={0}
            value={formData.salaryMax || ""}
            onChange={handleChange}
            placeholder="e.g. 45000"
            error={errors.salaryMax}
          />
          <ErrorLabel message={errors.salaryMax} />
        </div>

        <div>
          <Label htmlFor="employmentType" required>
            Employment type
          </Label>
          <Select
            id="employmentType"
            name="employmentType"
            value={formData.employmentType}
            onChange={handleChange}
            options={EMPLOYMENT_TYPE_OPTIONS}
            error={errors.employmentType}
          />
          <ErrorLabel message={errors.employmentType} />
        </div>

        <div>
          <Label htmlFor="workSetupType" required>
            Work setup
          </Label>
          <Select
            id="workSetupType"
            name="workSetupType"
            value={formData.workSetupType}
            onChange={handleChange}
            options={WORK_SETUP_TYPE_OPTIONS}
            error={errors.workSetupType}
          />
          <ErrorLabel message={errors.workSetupType} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="jobUrl">
            Job posting URL
          </Label>
          <Input
            id="jobUrl"
            name="jobUrl"
            value={formData.jobUrl}
            onChange={handleChange}
            placeholder="e.g. https://company.com/careers/frontend-developer"
            error={errors.jobUrl}
          />
          <ErrorLabel message={errors.jobUrl} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description" required>
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="What will this person be doing day to day?"
            error={errors.description}
          />
          <ErrorLabel message={errors.description} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="requirements" required>
            Requirements
          </Label>
          <Textarea
            id="requirements"
            name="requirements"
            rows={3}
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Years of experience, education, certifications..."
            error={errors.requirements}
          />
          <ErrorLabel message={errors.requirements} />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="skills" required hint="(comma-separated)">
            Skills
          </Label>
          <Input
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            placeholder="e.g. React, TypeScript, Node.js"
            error={errors.skills}
          />
          <ErrorLabel message={errors.skills} />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-5">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" isLoading={isLoading}>
          Post job
        </Button>
      </div>
    </form>
  );
};