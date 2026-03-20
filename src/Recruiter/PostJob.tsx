
import React, { useEffect, useState, useCallback } from "react";
import PostJobForm from "./PostJobForm";

const API_BASE = "http://localhost:5000/api"; // extract base URL

const RecruiterDashboard = () => {
  const [jobCount, setJobCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobCount = useCallback(async () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/jobs/recruiter/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          console.warn("Unauthorized. Skipping count fetch.");
          return;
        }
        throw new Error("Failed to fetch job count");
      }

      const data = await res.json();
      setJobCount(data.count);
    } catch (err:any) {
      console.error("Error fetching job count:", err.message);
      setError("Could not load job count");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobCount();
  }, [fetchJobCount]);

  return (
    <div className="w-screen p-6 text-center">
      <h1 className="text-2xl font-bold mb-4 ">Recruiter Dashboard</h1>

      {loading ? (
        <p className="mb-6 ">Loading job count...</p>
      ) : error ? (
        <p className="mb-6 text-red-500">{error}</p>
      ) : (
        <p className="mb-6">Total Jobs Posted: {jobCount}</p>
      )}

      <PostJobForm onJobPosted={fetchJobCount} />
    </div>
  );
};

export default RecruiterDashboard;
