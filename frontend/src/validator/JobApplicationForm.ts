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

 

  return errors;
};