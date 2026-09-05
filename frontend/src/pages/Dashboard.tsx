import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ApplicationStatus, JobApplicationResponse } from "../types/JobApplication";
import { AddApplication } from "../components/dashboard/AddApplication";
import StatsGrid from "../components/dashboard/StatsGrid";
import { ApplicationsTable, type JobApplicationRow } from "../components/dashboard/ApplicationTable";
import { useJob } from "../hooks/useJob";
import { useAppSelector } from "../hooks/reduxHooks";
import { ApplicationDetailsModal } from "../components/dashboard/ApplicationDetailsModal";

type StatusFilterValue = ApplicationStatus | "All Status";

const STATUS_FILTER_OPTIONS = [
  "All Status",
  "Saved",
  "Pending",
  "Interview",
  "Technical Interview",
  "Job Offer",
  "Rejected",
  "Withdrawn",
];

const STATUS_LABEL_TO_VALUE: Record<string, ApplicationStatus | undefined> = {
  "Saved": "Saved",
  "Pending": "Pending",
  "Interview": "Interview",
  "Technical Interview": "TechnicalInterview",
  "Job Offer": "JobOffer",
  "Rejected": "Rejected",
  "Withdrawn": "Withdrawn",
};

const DATE_FILTER_OPTIONS = ["All Time", "This Week", "This Month"];

const toTableRow = (job: JobApplicationResponse): JobApplicationRow => ({
  id: job.id,
  companyName: job.companyName ?? "",
  jobTitle: job.jobTitle ?? "",
  location: job.location ?? "",
  status: (job.applicationStatus as ApplicationStatus) ?? "Saved",
  applicationDate: job.applicationDate ?? "",
});

const computeStats = (jobs: JobApplicationResponse[]) => {
  const todayStr = new Date().toDateString();

  const countByStatus = (status: string) =>
    jobs.filter((job) => job.status === status).length;

  return {
    totalApplications: jobs.length,
    appliedToday: jobs.filter(
      (job) =>
        job.applicationDate &&
        new Date(job.applicationDate).toDateString() === todayStr
    ).length,
    pending: countByStatus("Pending"),
    interview: countByStatus("Interview"),
    technicalInterview: countByStatus("Technical Interview"),
    jobOffer: countByStatus("Job Offer"),
    rejected: countByStatus("Rejected"),
    withdrawn: countByStatus("Withdrawn"),
  };
};

const PAGE_SIZE = 10;

export const Dashboard = () => {
  const navigate = useNavigate();
  const { jobs } = useAppSelector((state) => state.jobs);
  const { getJobs, generateJob } = useJob();

  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("All Status");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState<JobApplicationResponse | null>(null);
  const [isModalOpen, setIsModelOpen] = useState(false)

  const handleViewApplication = (jobId: number) => {
    const application = jobs.items.find(job => job.id === jobId);
    if (!application) {
      console.error("Application not found")
      return; 
    }
    console.log("Job applications", application)
    setSelectedApplication(application);
    setIsModelOpen(true);
  }

  const handleCloseViewApplication = () => {
    setIsModelOpen(false);
    setSelectedApplication(null);
  }

  // Server already returns just this page's items — no client-side slicing
  const paginatedRows = jobs.items.map(toTableRow);

  const handleGenerateFromUrl = async (jobUrl: string) => {
    const result = await generateJob(jobUrl)
    console.log("Result: ", result)
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(searchQuery)
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery])

  // Refetch whenever the page changes
  useEffect(() => {
    const fetch = async () => {
      const jobs = await getJobs(
      2,  
      {
      page: currentPage,
      pageSize: PAGE_SIZE,
      status: STATUS_LABEL_TO_VALUE[statusFilter],
      search: debounceSearch,
    });
      console.log("Jobs: ", jobs)
    }
    fetch();
  }, [currentPage, statusFilter, debounceSearch]);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      </div>

      <StatsGrid stats={computeStats(jobs.items)} />

      <div className="mt-6">
        <AddApplication
          onGenerate={handleGenerateFromUrl}
          onAddManually={() => navigate("/create-job-application")}
        />
      </div>

      <div className="mt-6">
        <ApplicationsTable
          applications={paginatedRows}
          onViewDetails={handleViewApplication}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value as StatusFilterValue);
            setCurrentPage(1);
          }}
          statusOptions={STATUS_FILTER_OPTIONS}
          dateFilter={dateFilter}
          onDateFilterChange={(value) => {
            setDateFilter(value);
            setCurrentPage(1);
          }}
          dateOptions={DATE_FILTER_OPTIONS}
          searchQuery={searchQuery}
          onSearchChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1);
          }}
          currentPage={jobs.page}
          totalPages={jobs.totalPages}
          totalResults={jobs.totalCount}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}          
          onActionMenuClick={(application) => {
            console.log("action menu", application);
          }}
        />
      </div>

      <div>
        <ApplicationDetailsModal 
          job={selectedApplication}
          isOpen={isModalOpen}
          onClose={handleCloseViewApplication}
        />
      </div>
    </div>
  );
};