import { useState } from "react";
import { JobApplicationForm } from "../components/forms/JobApplicationForm";
import { Modal } from "../components/ui/Modal";
import type { JobApplicationFormType } from "../types/JobApplication";
import { AddApplication } from "../components/dashboard/AddApplication";
import StatsGrid from "../components/dashboard/StatsGrid";
import { ApplicationsTable, type JobApplicationRow } from "../components/dashboard/ApplicationTable";


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

// NOTE: maps your job state into table rows. Adjust field names below
// if JobApplicationFormType uses different property names.
const toTableRow = (job: JobApplicationFormType, index: number): JobApplicationRow => ({
  id: (job as any).id ?? String(index),
  companyName: (job as any).companyName ?? "",
  jobTitle: (job as any).jobTitle ?? "",
  location: (job as any).location ?? "",
  status: (job as any).status ?? "Pending",
  applicationDate: (job as any).applicationDate ?? (job as any).dateApplied ?? "",
});

// NOTE: assumes JobApplicationFormType has `status` and `dateApplied` fields.
// Adjust the field names below to match your actual type if they differ.
const computeStats = (jobs: JobApplicationFormType[]) => {
  const todayStr = new Date().toDateString();

  const countByStatus = (status: string) =>
    jobs.filter((job) => (job as any).status === status).length;

  return {
    totalApplications: jobs.length,
    appliedToday: jobs.filter(
      (job) =>
        (job as any).dateApplied &&
        new Date((job as any).dateApplied).toDateString() === todayStr
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
  const [jobs, setJobs] = useState<JobApplicationFormType[]>([]);

  const [statusFilter, setStatusFilter] = useState("All Status");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleCreateJob = async (data: JobApplicationFormType) => {
    // TODO: replace with your actual API call, e.g. POST /api/jobs
    setJobs((prev) => [...prev, data]);
    setShowForm(false);
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