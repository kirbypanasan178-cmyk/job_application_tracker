import { MapPin, Search, MoreVertical } from "lucide-react";
import { StatusBadge, type ApplicationStatus } from "./StatusBadge";
import { Pagination } from "./Pagination";
import { CompanyAvatar } from "./CompanyAvatar";

export interface JobApplicationRow {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  status: ApplicationStatus;
  applicationDate: string;
}

interface ApplicationsTableProps {
  applications: JobApplicationRow[];

  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  statusOptions: string[];

  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  dateOptions: string[];

  searchQuery: string;
  onSearchChange: (value: string) => void;

  currentPage: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;

  onViewDetails: (application: JobApplicationRow) => void;
  onActionMenuClick: (application: JobApplicationRow) => void;
}

const TABLE_COLUMNS = [
  "Company Name",
  "Job Title",
  "Location",
  "Status",
  "Application Date",
  "Action",
];

export const ApplicationsTable = ({
  applications,
  statusFilter,
  onStatusFilterChange,
  statusOptions,
  dateFilter,
  onDateFilterChange,
  dateOptions,
  searchQuery,
  onSearchChange,
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
  onViewDetails,
  onActionMenuClick,
}: ApplicationsTableProps) => {
  const rangeStart = (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalResults);

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Filters + search */}
      <div className="flex flex-wrap items-end justify-between gap-4 p-6 pb-4">
        <div className="flex gap-4">
          <FilterSelect
            label="Filter by status"
            value={statusFilter}
            options={statusOptions}
            onChange={onStatusFilterChange}
          />
          <FilterSelect
            label="Filter by date"
            value={dateFilter}
            options={dateOptions}
            onChange={onDateFilterChange}
          />
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search company or job title..."
            className="w-72 rounded-lg border border-gray-200 py-2.5 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-y border-gray-100">
              {TABLE_COLUMNS.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-400"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CompanyAvatar companyName={application.companyName} />
                    <span className="text-sm font-medium text-gray-900">
                      {application.companyName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">{application.jobTitle}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {application.location}
                  </div>
                </td>

                <td className="px-6 py-4">
                  <StatusBadge status={application.status} />
                </td>

                <td className="px-6 py-4 text-sm text-gray-500">{application.applicationDate}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewDetails(application)}
                      className="rounded-lg border border-gray-200 px-3.5 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
                    >
                      View Details
                    </button>
                    <button
                      type="button"
                      onClick={() => onActionMenuClick(application)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                      aria-label="More actions"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer: result count + pagination */}
      <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
        <p className="text-sm text-gray-500">
          Showing {rangeStart} to {rangeEnd} of {totalResults} results
        </p>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

interface FilterSelectProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const FilterSelect = ({ label, value, options, onChange }: FilterSelectProps) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};