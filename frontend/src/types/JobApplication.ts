export type ApplicationStatus =
  | "Saved"
  | "Pending"
  | "Applied"
  | "Interview"
  | "TechnicalInterview"
  | "JobOffer"
  | "Rejected"
  | "Withdrawn";

type EmploymentType =
  | "FullTime"
  | "PartTime"
  | "Contract"
  | "Internship"
  | "Freelance";

type WorkSetupType = 
| "Onsite"
| "Remote"
| "Hybrid"


export interface JobApplicationFormType {
  jobTitle: string;
  jobUrl?: string;
  companyName: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  requirements?: string;
  skills?: string;
  employmentType?: EmploymentType;
  workSetupType?: WorkSetupType;
}

export interface JobApplicationTableDataType {
  _id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  status: string;
  applicationDate: string;
}

export interface JobApplicationResponse {
  _id: string;
  jobUrl: string;
  // Basic information
  companyName: string;
  jobTitle: string;
  location: string;

  // Application information
  status: string;
  applicationDate: string;

  applicationStatus: ApplicationStatus;
  // Job details
  salaryMin: number;
  salaryMax: number;

  description: string;
  requirements: string;
  skills: string;
  employmentType: EmploymentType;
  workSetupType: WorkSetupType;
}