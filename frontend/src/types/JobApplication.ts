export interface JobApplicationFormType {
  jobTitle: string;
  companyName: string;
  location: string;
  salary: number;
  description: string;
  requirements: string;
  skills: string;
  employmentType: string;
}

export interface JobApplicationTableDataType {
  id: number;
  companyName: string;
  jobTitle: string;
  location: string;
  status: string;
  applicationDate: string;
}