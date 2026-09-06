import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobApplicationForm } from "../components/forms/JobApplicationForm";
import { useJob } from "../hooks/useJob";
import { useAppSelector } from "../hooks/reduxHooks";
import type { JobApplicationFormType } from "../types/JobApplication";

export const UpdateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getJob, updateJob } = useJob();
  const { loading, error, job } = useAppSelector((state) => state.jobs);

  useEffect(() => {
    if (id) getJob(Number(id));
  }, [id]);

  const handleSubmit = async (data: JobApplicationFormType) => {
    if (!id) return;
    const result = await updateJob(Number(id), data);
    if (result.success) {
      navigate("/");
    }
  };

  if (!job) {
    return <div className="mx-auto max-w-2xl p-6 text-sm text-slate-500">Loading job...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <JobApplicationForm
        key={id}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/")}
        isLoading={loading}
        initialValues={job}
      />
    </div>
  );
};