import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../Component/Pagination";
import { RequireLogin } from "../../proctedRoute/RequireLogin";
import { motion } from "framer-motion";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  atsScore?: number;
  matchedSkills?: string[];
  missingSkills?: string[];
}

const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

export default function RecommendedJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  const totalPages = Math.max(1, Math.ceil(jobs.length / jobsPerPage));
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setJobs([]);
      return;
    }

    const fetchRecommendedJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/jobs/user/recommended-jobs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Sort by ATS score (highest first)
        const sortedJobs = (res.data.recommendedJobs || []).sort(
          (a: Job, b: Job) => (b.atsScore || 0) - (a.atsScore || 0)
        );

        setJobs(sortedJobs);
      } catch (err) {
        console.error(err);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, []);

  if (loading)
    return <p className="text-gray-500 mt-6">Loading recommended jobs...</p>;

  if (!jobs.length) {
    return (
      <div className="bg-gray-50 border rounded-xl p-6 text-center mt-6">
        <p className="text-gray-600">No recommendations yet.</p>
        <p className="text-sm text-gray-500 mt-2">
          Upload your resume in ATS Analyzer to get personalized matches.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-xl transition duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg text-gray-900">
                {job.title}
              </h3>

              {job.atsScore !== undefined && (
                <span className="text-xs px-3 py-1 rounded-full font-medium bg-gray-100 text-gray-700">
                  {job.atsScore.toFixed(1)}%
                </span>
              )}
            </div>

            {/* Company */}
            <p className="text-sm text-gray-600 font-medium">{job.company}</p>
            <p className="text-sm text-gray-500 mb-4">{job.location}</p>

            {/* ATS Progress */}
            {job.atsScore !== undefined && (
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">ATS Match</span>
                  <span className="font-semibold text-gray-800">
                    {job.atsScore.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${getScoreColor(job.atsScore)} h-2 rounded-full`}
                    style={{ width: `${job.atsScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            {job.description && (
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {job.description}
              </p>
            )}

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {job.matchedSkills?.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                >
                  ✔ {skill}
                </span>
              ))}
              {job.missingSkills?.map((skill) => (
                <span
                  key={skill}
                  className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full"
                >
                  ✖ {skill}
                </span>
              ))}
            </div>

            {/* Button */}
            <RequireLogin>
              <a
                href={`/jobs/${job._id}`}
                className="block w-full text-center px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:scale-105 transition"
              >
                View Job
              </a>
            </RequireLogin>

            {/* Best Match Badge */}
            {index === 0 && (
              <div className="absolute top-3 right-3 text-[10px] bg-yellow-400 text-black px-2 py-1 rounded-full font-bold">
                ⭐ Best Match
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </section>
  );
}