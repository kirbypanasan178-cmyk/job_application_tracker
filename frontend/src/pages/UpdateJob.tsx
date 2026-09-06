import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobApplicationForm } from "../components/forms/JobApplicationForm";
import { useJob } from "../hooks/useJob";
import { useAppSelector } from "../hooks/reduxHooks";
import type { JobApplicationFormType } from "../types/JobApplication";

export const UpdateJob = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getJobs, updateJob } = useJob();
  const { loading, error } = useAppSelector((state) => state.jobs);

  const [initialValues, setInitialValues] = useState<Partial<JobApplicationFormType> | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const result = await getJobs(Number(id));
      if (result.success) {
        setInitialValues(result.data);
      } else {
        setFetchError(result.error ?? "Failed to load job");
      }
    })();
  }, [id]);

  const handleSubmit = async (data: JobApplicationFormType) => {
    if (!id) return;
    const result = await updateJob(Number(id), data);
    if (result.success) {
      navigate("/");
    }
  };

  if (!initialValues && !fetchError) {
    return <div className="mx-auto max-w-2xl p-6 text-sm text-slate-500">Loading job...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      {(error || fetchError) && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error || fetchError}
        </div>
      )}
      {initialValues && (
        <JobApplicationForm
          key={id}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/")}
          isLoading={loading}
          initialValues={initialValues}
        />
      )}
    </div>
  );
};