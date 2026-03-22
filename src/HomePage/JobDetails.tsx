
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MultiStepApplyForm from "./apply";

export default function JobDetails() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyLoading, setApplyLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/jobs/${id}`);
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setJob(data);
        setError("");
      } catch (err) {
        setError(err.message || "Failed to fetch job");
        setJob(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    setShowApplyForm(true);
  };

  // Callback for form submission
  const handleApplicationSubmit = async (isLoading, message) => {
    // isLoading: true when submission starts, false when finished
    // message: success/error message to show
    setApplyLoading(isLoading);
    if (message) setStatusMessage(message);
    if (!isLoading) setShowApplyForm(false); // close modal when done
  };

  if (loading) return <p className="p-10 text-center text-gray-600">Loading job...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;

  return (
    <section className="max-w-3xl mx-auto px-6 md:px-10 py-16 space-y-6 relative">
      {/* Job Header */}
      <h1 className="text-3xl font-semibold">{job.title}</h1>
      <p className="text-gray-600">{job.company} • {job.location}</p>

      {/* Summary */}
      {job.summary && <p className="mt-2 mb-4 text-gray-700 font-medium">{job.summary}</p>}

      {/* Work Mode & Employment Type */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
        {job.workMode && <span>Mode: {job.workMode}</span>}
        {job.employmentType && <span>Type: {job.employmentType}</span>}
      </div>

      {/* Salary */}
      {(job.salaryMin || job.salaryMax) && (
        <p className="mb-4 text-gray-700">
          <strong>Salary:</strong>{" "}
          {job.salaryMin ? `$${job.salaryMin}` : "N/A"} - {job.salaryMax ? `$${job.salaryMax}` : "N/A"}
        </p>
      )}

      {/* Description */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Job Description</h3>
        <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
      </div>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Skills Required</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {job.experience && (
        <p className="mb-4">
          <strong>Experience:</strong> {job.experience.charAt(0).toUpperCase() + job.experience.slice(1)}
        </p>
      )}

      {/* Status Message */}
      {statusMessage && <p className="mb-4 text-sm text-green-600">{statusMessage}</p>}

      {/* Apply Button */}
      <button
        onClick={handleApplyClick}
        disabled={applyLoading}
        className="bg-green-600 text-black px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
      >
        {applyLoading ? "Applying..." : "Apply Now"}
      </button>
      

      {/* Multi-step Apply Form Modal */}
      {showApplyForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowApplyForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 font-bold text-lg"
            >
              ×
            </button>

            {/* Pass handleApplicationSubmit as a prop */}
            <MultiStepApplyForm
              jobId={job._id}
              onClose={() => setShowApplyForm(false)}
              onSubmitStatus={handleApplicationSubmit} // callback updates Apply button
            />
          </div>
        </div>
      )}
    </section>
  );
}
