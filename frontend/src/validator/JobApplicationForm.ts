import type { JobApplicationFormType } from "../types/JobApplication";

export const validateJobApplicationForm = (
  form: JobApplicationFormType
) => {
  const errors: Partial<Record<keyof JobApplicationFormType, string>> = {};

  if (!form.jobTitle.trim()) {
    errors.jobTitle = "Job title is required";
  }

  if (!form.companyName.trim()) {
    errors.companyName = "Company name is required";
  }

  if (!form.location.trim()) {
    errors.location = "Location is required";
  }

  if (form.salary < 0) {
    errors.salary = "Salary cannot be negative";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required";
  }

  if (!form.requirements.trim()) {
    errors.requirements = "Requirements are required";
  }

  if (!form.skills.trim()) {
    errors.skills = "Skills are required";
  }

  if (!form.employmentType.trim()) {
    errors.employmentType = "Employment type is required";
  }

  return errors;
};