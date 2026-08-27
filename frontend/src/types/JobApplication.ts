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
  companyName: string;
  location: string;
  salary: number;
  description: string;
  requirements: string;
  skills: string;
  employmentType: EmploymentType;
  workSetupType: WorkSetupType;
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

  // Basic information
  companyName: string;
  jobTitle: string;
  location: string;

  // Application information
  status: string;
  applicationDate: string;

   applicationStatus: string;
  // Job details
  salary: number | null;
  description: string;
  requirements: string;
  skills: string;
  employmentType: EmploymentType;
  workSetupType: WorkSetupType;
}