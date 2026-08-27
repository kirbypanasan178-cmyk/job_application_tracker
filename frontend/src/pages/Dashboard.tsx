import { useEffect, useState } from "react";
import { JobApplicationForm } from "../components/forms/JobApplicationForm";
import { Modal } from "../components/ui/Modal";
import type { JobApplicationFormType, JobApplicationResponse } from "../types/JobApplication";
import { AddApplication } from "../components/dashboard/AddApplication";
import StatsGrid from "../components/dashboard/StatsGrid";
import { ApplicationsTable, type JobApplicationRow } from "../components/dashboard/ApplicationTable";
import { useJob } from "../hooks/useJob";
import { useAppSelector } from "../hooks/reduxHooks";
import type { ApplicationStatus } from "../components/dashboard/StatusBadge";


const STATUS_FILTER_OPTIONS = [
  "All Status",
  "Pending",
  "Interview",
  "Technical Interview",
  "Job Offer",
  "Rejected",
  "Withdrawn",
];

const DATE_FILTER_OPTIONS = ["All Time", "This Week", "This Month"];

const PAGE_SIZE = 6;

const toTableRow = (job: JobApplicationResponse): JobApplicationRow => ({
  id: job._id,
  companyName: job.companyName ?? "",
  jobTitle: job.jobTitle ?? "",
  location: job.location ?? "",
  status: (job.status as ApplicationStatus) ?? "Pending",
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

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const { jobs } = useAppSelector((state) => state.jobs);

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { createJob, getJobById } = useJob();

  const handleCreateJob = async (data: JobApplicationFormType) => {
    const result = await createJob(data);
    if (result.success) {
      setShowForm(false);
    }
    // TODO: surface result.message on failure (toast/inline error)
  };

  const handleGenerateFromUrl = async (jobUrl: string) => {
    // TODO: call your job-detail-extraction API with jobUrl,
    // then prefill/open the form with the extracted data.
    setShowForm(true);
  };

  const tableRows = jobs.map(toTableRow);

  const filteredRows = tableRows.filter((row) => {
    const matchesStatus = statusFilter === "All Status" || row.status === statusFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      row.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());

    // TODO: apply real date-range filtering once applicationDate format is finalized
    return matchesStatus && matchesSearch;
  });

  const totalResults = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  useEffect(() => {
  const loadJobs = async () => {
    const result = await getJobById("1");

    console.log("Job applications:", result);
  };

  loadJobs();
}, []);



  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      </div>

      <StatsGrid stats={computeStats(jobs)} />

      <div className="mt-6">
        <AddApplication
          onGenerate={handleGenerateFromUrl}
          onAddManually={() => setShowForm(true)}
        />
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)}>
        <JobApplicationForm
          onSubmit={handleCreateJob}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <div className="mt-6">
        <ApplicationsTable
          applications={paginatedRows}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
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
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          onViewDetails={(application) => {
            // TODO: navigate to application details or open a details modal
            console.log("view details", application);
          }}
          onActionMenuClick={(application) => {
            // TODO: open dropdown menu (edit/delete/etc.)
            console.log("action menu", application);
          }}
        />
      </div>
    </div>
  );
};