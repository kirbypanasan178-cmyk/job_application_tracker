import type { JobApplicationFormType, JobApplicationResponse } from "../types/JobApplication";
import { apiFetch } from "../utils/apiFetch";

export const getJobsRequest = () => {
  return apiFetch<JobApplicationResponse[]>("/JobApplications");
};

export const getJobByIdRequest = (id: string) => {
  return apiFetch<JobApplicationResponse[]>(`/JobApplications/${id}`);
};

export const createJobRequest = (data: JobApplicationFormType) => {
  return apiFetch<JobApplicationResponse>("/JobApplications", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateJobRequest = (
  id: string,
  data: JobApplicationFormType
) => {
  return apiFetch<JobApplicationResponse>(`/JobApplications/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteJobRequest = (id: string) => {
  return apiFetch<JobApplicationResponse>(`/JobApplications/${id}`, {
    method: "DELETE",
  });
};