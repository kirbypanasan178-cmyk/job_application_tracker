import type { ApplicationStatus } from "./JobApplication";


export interface PaginatedResponse<T> {
    items: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

export interface JobApplicationQuery {
  search?: string;
  status?: ApplicationStatus;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  descending?: boolean;
}