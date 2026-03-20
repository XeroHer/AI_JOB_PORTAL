import { useEffect, useState } from "react";
import Analyzer from "./ResumeAnalyzer";
import Sidebar from "./Profile/Sidebar";

export default function JobSeekerDashboard() {
  const [applicationsSent, setApplicationsSent] = useState(0);
  const [avgAtsScore, setAvgAtsScore] = useState("0%");
  const [avgJobMatch, setAvgJobMatch] = useState("0%");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1️⃣ Fetch applications count
        const appRes = await fetch(
          "http://localhost:5000/api/jobs/applications/count",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const appData = await appRes.json();
        setApplicationsSent(appData.count || 0);

        // 2️⃣ Fetch recommended jobs (includes ATS score & avgAtsScore)
        const recRes = await fetch(
          "http://localhost:5000/api/jobs/user/recommended-jobs",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const recData = await recRes.json();
        const jobs = recData.recommendedJobs || [];

        

        // ✅ Use backend avgAtsScore if provided
        if (typeof recData.avgAtsScore === "number") {
          setAvgAtsScore(`${recData.avgAtsScore.toFixed(1)}%`);
        } else if (jobs.length > 0) {
          // fallback: compute average from jobs
          const avgScore =
            jobs.reduce((sum, job) => sum + (job.atsScore || 0), 0) / jobs.length;
          setAvgAtsScore(`${avgScore.toFixed(1)}%`);
        } else {
          setAvgAtsScore("0%");
        }

        // ✅ Avg Job Match
        if (jobs.length > 0) {
          const avgMatch =
            jobs.reduce((sum, job) => sum + (job.atsScore || 0), 0) / jobs.length;
          setAvgJobMatch(`${avgMatch.toFixed(1)}%`);
        } else {
          setAvgJobMatch("0%");
        }
      } catch (err) {
        
        setAvgAtsScore("0%");
        setAvgJobMatch("0%");
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    { title: "Resume ATS Score", value: avgAtsScore },
    { title: "Avg Job Match %", value: avgJobMatch },
    { title: "Applications Sent", value: applicationsSent },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 right-0 left-0 bg-white shadow-md z-50 flex justify-between items-center px-4 h-14">
        <h1 className="text-lg font-semibold text-gray-700">Dashboard</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md focus:outline-none"
        >
          {sidebarOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-800"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-60 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:shadow-none`}
      >
        <Sidebar />
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-opacity-30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:ml mt-14 md:mt-0">
        {/* Stats Cards */}
        <div className="flex flex-wrap gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-white p-4 rounded-lg shadow flex-1 min-w-[150px] sm:min-w-[200px]">
              <h3 className="text-gray-500 text-sm sm:text-base">{stat.title}</h3>
              <p className="text-xl sm:text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <Analyzer />
      </main>
    </div>
  );
}