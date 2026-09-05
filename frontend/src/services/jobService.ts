import type { JobApplicationFormType, JobApplicationResponse } from "../types/JobApplication";
import type { JobApplicationQuery, PaginatedResponse } from "../types/pagination";
import { apiFetch } from "../utils/apiFetch";

export const getJobsRequest = (id: number, query: JobApplicationQuery) => {
  const params = new URLSearchParams();
  if (query.search) {
    params.append("Search", query.search)
  }
  if (query.status) {
    params.append("Status", query.status);
  }

  params.append("Page", String(query.page ?? 1));
  params.append("PageSize", String(query.pageSize ?? 10));
  params.append("SortBy", query.sortBy ?? "CreatedAt");
  params.append("Descending", String(query.descending ?? true));

  return apiFetch<PaginatedResponse<JobApplicationResponse>>(`/JobApplication/user/${id}?${params.toString()}`);
};

export const getJobByIdRequest = (id: number) => {
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

export const deleteJobRequest = (id: number) => {
  return apiFetch<JobApplicationResponse>(`/JobApplications/${id}`, {
    method: "DELETE",
  });
};

export const generateJobRequest = (jobUrl: string) => {
  return apiFetch<JobApplicationResponse>("/JobApplication/extract", {
    method: "POST",
    body: JSON.stringify({ url: jobUrl})
  });
}