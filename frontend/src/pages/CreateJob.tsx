import { useNavigate } from "react-router-dom";
import { JobApplicationForm } from "../components/forms/JobApplicationForm";
import { useJob } from "../hooks/useJob";
import { useAppSelector } from "../hooks/reduxHooks";
import type { JobApplicationFormType } from "../types/JobApplication";

export const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob } = useJob();
  const { loading, error } = useAppSelector((state) => state.jobs);

  const handleSubmit = async (data: JobApplicationFormType) => {
    const result = await createJob(data);
    if (result.success) {
      navigate("/");
    }
    // on failure, `error` from the store will already be populated
    // and can be rendered below
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <JobApplicationForm
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        isLoading={loading}
      />
    </div>
  );
};