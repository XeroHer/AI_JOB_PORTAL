import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Applicant {
  _id: string;
  status: string;
}

const RecruiterDashboardPage = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobsCount, setJobsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;

      try {
        /* Fetch jobs count */
        const resJobs = await fetch(
          `${import.meta.env.VITE_API_URL}/api/jobs/recruiter/count`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const jobsData = await resJobs.json();
        setJobsCount(jobsData.count || 0);

        /* Fetch applicants */
        const resApps = await fetch(
         `${import.meta.env.VITE_API_URL}/api/jobs/recruiter/applicants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const appsData = await resApps.json();
        if (Array.isArray(appsData)) setApplicants(appsData);

      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  /* Status counts */

  const counts = applicants.reduce(
    (acc, a) => {
      const status = a.status?.toLowerCase();

      if (status === "pending") acc.pending++;
      else if (status === "reject") acc.rejected++;
      else if (status === "shortlist") acc.shortlisted++;

      return acc;
    },
    { pending: 0, rejected: 0, shortlisted: 0 }
  );

  const totalApplicants =
    counts.pending + counts.rejected + counts.shortlisted;

  const pieData = [
    { name: "Pending", value: counts.pending, color: "#FACC15" },
    { name: "Rejected", value: counts.rejected, color: "#EF4444" },
    { name: "Shortlisted", value: counts.shortlisted, color: "#10B981" },
  ];

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <span className="text-gray-500 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h2 className="text-xl font-semibold mb-4 text-center">
        Recruiter Dashboard
      </h2>
     <div className="flex justify-center gap-8 mb-6">
     <div className="bg-white shadow-md rounded-lg p-4 text-center w-40">
          <p className="text-gray-500 text-sm">Jobs Posted</p>
          <p className="text-xl font-bold text-blue-600">{jobsCount}</p>
        </div>

       <div className="bg-white shadow-md rounded-lg p-4 text-center w-40">
          <p className="text-gray-500 text-sm">Applications</p>
          <p className="text-xl font-bold text-purple-600">
            {totalApplicants}
          </p>
        </div>
       </div>
      {/* Same Card UI */}

      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">

        {/* Pie Chart */}

        <div className="flex-1">
          <ResponsiveContainer width="100%" height={100}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={40}
                label
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value: number) =>
                  `${value} (${
                    totalApplicants
                      ? ((value / totalApplicants) * 100).toFixed(1)
                      : 0
                  }%)`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Bars */}

        <div className="flex-1 flex flex-col justify-center">

          {pieData.map((s) => {
            const width = totalApplicants
              ? (s.value / totalApplicants) * 100
              : 0;

            return (
              <div key={s.name} className="mb-3">

                <div className="flex justify-between">
                  <span className="text-gray-600">{s.name}</span>
                  <span className="font-bold">{s.value}</span>
                </div>

                <div className="w-full h-1 bg-gray-200 rounded-full">

                  <div
                    className="h-1 rounded-full"
                    style={{
                      width: `${width}%`,
                      backgroundColor: s.color,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboardPage;