import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

import RecommendedJobsPage from "../HomePage/AIRecommendation";

// ----------------- Types -----------------
interface Job {
  _id: string;
  title: string;
  description?: string;
}

interface ATSAnalysis {
  atsScore: number;
  skills: string[];
  missingSkills?: string[];
}

interface HistoryEntry {
  date: string;
  score: number;
}

// ----------------- Component -----------------
export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [jobsLoading, setJobsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----------------- Load History -----------------
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("analysisHistory");
      if (savedHistory) setHistory(JSON.parse(savedHistory));
    } catch (err) {
      console.error("Failed to parse history from localStorage", err);
    }
  }, []);

  // ----------------- Fetch Jobs -----------------
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setJobsLoading(true);
        const res = await axios.get("http://localhost:5000/api/jobs");
        setJobs(res.data.jobs || res.data || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setJobsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // ----------------- Fetch Recommended Jobs -----------------
  useEffect(() => {
    const fetchUserRecommendedJobs = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/jobs/user/recommended-jobs",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRecommendedJobs(res.data.recommendedJobs || []);
      } catch (err) {
        console.error("Failed to fetch recommended jobs", err);
        setRecommendedJobs([]);
      }
    };
    fetchUserRecommendedJobs();
  }, []);

  // ----------------- File Handlers -----------------
  const handleBrowse = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return setFile(null);

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload PDF or Word document.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File is too large. Maximum 5MB allowed.");
      return;
    }

    setFile(selectedFile);
    setError("");
  };

  // ----------------- Upload & Analyze -----------------
  const handleUpload = async () => {
    if (!file) {
      setError("Please upload a resume file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("resume", file);
    if (selectedJobId) formData.append("jobId", selectedJobId);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/jobs/ats/analyze",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const analysisData: ATSAnalysis = res.data.atsAnalysis || null;
      const recommended: Job[] = res.data.recommendedJobs || [];

      setAnalysis(analysisData);
      setRecommendedJobs(recommended);

      // Save analysis in localStorage
      localStorage.setItem("analysis", JSON.stringify(analysisData));

      // Update history
      const newEntry: HistoryEntry = {
        date: new Date().toLocaleDateString(),
        score: analysisData?.atsScore || 0,
      };
      const updatedHistory = [...history, newEntry];
      setHistory(updatedHistory);
      localStorage.setItem("analysisHistory", JSON.stringify(updatedHistory));
    } catch (err: any) {
      setError(err.response?.data?.message || "ATS analysis failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------- Render -----------------
 
   return (
  <section className="max-w-6xl mx-auto px-6 py-10">
    <h2 className="text-2xl font-semibold mb-6">Resume Analyzer</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Upload Card */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-4">
        {jobsLoading ? (
          <p className="text-sm text-gray-500">Loading jobs...</p>
        ) : (
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Job (Optional)</option>
            {jobs?.length > 0 ? (
              jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))
            ) : (
              <option disabled>No jobs available</option>
            )}
          </select>
        )}

        <input
          type="file"
          ref={fileInputRef}
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          hidden
        />

        <button
          onClick={handleBrowse}
          className="w-full bg-purple-600 text-white py-2 rounded hover:opacity-90 transition"
        >
          Browse Resume
        </button>

        {file && (
          <p className="text-sm text-gray-600 text-center">{file.name}</p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded disabled:opacity-50 hover:opacity-90 transition"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>

        {error && (
          <p className="text-red-500 text-center text-sm">{error}</p>
        )}
      </div>

      {/* Analysis Card */}
      <div className="bg-white p-6 rounded-2xl shadow">
        {analysis ? (
          <>
            <h3 className="font-semibold mb-3">ATS Analysis</h3>
            <p className="mb-2">
              <strong>Score:</strong> {analysis.atsScore}%
            </p>
            <p className="mb-2">
              <strong>Skills:</strong> {analysis.skills?.join(", ") || "None"}
            </p>
            {analysis.missingSkills?.length > 0 && (
              <p className="mb-2 text-red-500">
                <strong>Missing:</strong> {analysis.missingSkills.join(", ")}
              </p>
            )}
          </>
        ) : (
          <p className="text-gray-500">Upload a resume to see analysis</p>
        )}
      </div>
    </div>

    {/* Recommended Jobs */}
    <div className="mt-6">
      {jobsLoading || recommendedJobs === null ? (
        <p className="text-gray-500">Loading recommended jobs...</p>
      ) : (
        <RecommendedJobsPage jobs={recommendedJobs || []} />
      )}
    </div>
  </section>
);
}