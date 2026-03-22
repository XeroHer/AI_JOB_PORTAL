import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "../Component/Pagination";

const RecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch jobs
  const fetchJobs = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/recruiter`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Error fetching jobs:", err.message);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Show toast after edit navigation
  useEffect(() => {
    if (location.state?.showToast) {
      alert(location.state.showToast);
      fetchJobs();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Delete job
  const handleDelete = async (jobId) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return navigate("/login");

    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${jobId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete job");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      alert("Job deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Error deleting job: " + err.message);
    }
  };

  // Pagination logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex flex-col items-center px-4 md:px-16 py-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-2 md:mb-0">Your Jobs</h2>
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Posted Job
        </button>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs posted yet.</p>
      ) : (
        <div className="space-y-4 w-full max-w-4xl">
          {currentJobs.map((job) => (
            <div
              key={job._id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div className="mb-2 md:mb-0">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-gray-600">{job.company}</p>
                <p className="text-gray-500">{job.location}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2 md:mt-0">
                <button
                  onClick={() =>
                    navigate(`/recruiter/jobs/edit/${job._id}`, {
                      state: { fromJobsPage: true },
                    })
                  }
                  className="bg-yellow-500 text-black px-3 py-1 rounded-md hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(job._id)}
                  className="bg-red-600 text-black px-3 py-1 rounded-md hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {jobs.length > jobsPerPage && (
        <div className="mt-6 flex justify-center w-full max-w-4xl">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default RecruiterJobs;