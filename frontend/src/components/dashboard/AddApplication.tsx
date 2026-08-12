import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";

interface AddApplicationProps {
  onGenerate: (jobUrl: string) => void;
  onAddManually: () => void;
  isGenerating?: boolean;
}

export const AddApplication = ({
  onGenerate,
  onAddManually,
  isGenerating = false,
}: AddApplicationProps) => {
  const [jobUrl, setJobUrl] = useState("");

  const handleGenerateClick = () => {
    const trimmedUrl = jobUrl.trim();
    if (!trimmedUrl) return;
    onGenerate(trimmedUrl);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Header */}
      <h2 className="text-base font-semibold text-gray-900">Add Application</h2>
      <p className="mt-1 text-sm text-gray-500">
        Paste job URL to automatically extract job details
      </p>

      {/* URL input + Generate button */}
      <div className="mt-4 flex gap-3">
        <input
          type="text"
          value={jobUrl}
          onChange={(e) => setJobUrl(e.target.value)}
          placeholder="Paste job posting URL here (e.g., https://linkedin.com/jobs/view/123456)"
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="button"
          onClick={handleGenerateClick}
          disabled={isGenerating || !jobUrl.trim()}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {isGenerating ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Divider with "or" */}
      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Add Manually button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onAddManually}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <Plus className="h-4 w-4" />
          Add Manually
        </button>
      </div>
    </div>
  );
};