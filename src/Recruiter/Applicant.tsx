import React, { useEffect, useState, useMemo } from "react";
import ApplicantsTable from "./ApplicantsTable";

const ApplicantsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  // ---------------- Fetch Jobs ----------------
  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobs/recruiter", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch jobs");

      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error("Fetch jobs error:", err.message);
    }
  };

  // ---------------- Fetch Applicants ----------------
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        "http://localhost:5000/api/jobs/recruiter/applicants",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch applicants");

      const data = await res.json();
      setApplicants(data);
    } catch (err) {
      console.error("Fetch applicants error:", err.message);
      setApplicants([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Update Status ----------------
  const updateStatus = async (applicationId, status) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: data.status } : app
        )
      );
    } catch (err) {
      console.error("Update status error:", err.message);
      alert("Failed to update application status");
    }
  };

  // ---------------- Initial Load ----------------
  useEffect(() => {
    fetchJobs();
    fetchApplicants();
  }, []);

  // ---------------- Filtering ----------------
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const matchesJob =
        selectedJob === "all" || app.jobId?._id === selectedJob;

      const matchesStatus =
        selectedStatus === "all" || app.status === selectedStatus;

      const matchesSearch =
        app.name?.toLowerCase().includes(search.toLowerCase()) ||
        app.email?.toLowerCase().includes(search.toLowerCase());

      return matchesJob && matchesStatus && matchesSearch;
    });
  }, [applicants, selectedJob, selectedStatus, search]);

  return (
    <div className="w-screen px-4 sm:px-6 lg:px-20 py-6">
      {/* Title */}
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Job Applicants
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        {/* Search */}
        <input
          type="text"
          placeholder="Search by name or email..."
          className="border rounded px-3 py-2 w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Job Filter */}
        <select
          className="border rounded px-3 py-2 w-full sm:w-auto"
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
        >
          <option value="all">All Jobs</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>
              {job.title}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          className="border rounded px-3 py-2 w-full sm:w-auto"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="shortlist">Shortlisted</option>
          <option value="reject">Rejected</option>
          <option value="accepted">Accepted</option>
        </select>
      </div>

      {/* Content */}
      {loading && <p>Loading applicants...</p>}

      {!loading && error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredApplicants.length === 0 && (
        <p>No applicants found.</p>
      )}

      {!loading && !error && filteredApplicants.length > 0 && (
        <ApplicantsTable
          applicants={filteredApplicants}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
};

export default ApplicantsPage;