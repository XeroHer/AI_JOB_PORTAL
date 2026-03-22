import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Application { _id: string; status: string; }

const DashboardPage = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data)) setApps(data);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const counts = apps.reduce(
    (acc, a) => {
      const status = a.status?.toLowerCase();
      if (status === "pending") acc.pending++;
      else if (status === "reject") acc.rejected++;
      else if (status === "shortlist") acc.shortlisted++;
      return acc;
    },
    { pending: 0, rejected: 0, shortlisted: 0 }
  );

  const total = counts.pending + counts.rejected + counts.shortlisted;

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
      <h2 className="text-xl font-semibold mb-4 text-center">Application Dashboard</h2>
      <div className="text-center mb-4">
  <span className="text-gray-700 text-lg font-normal">
    Total Jobs Applied:{" "}
  </span>
  <span className="text-blue-600 font-bold">{total}</span>
</div>

      {/* Single Card containing Pie Chart + Status Bars */}
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
        {/* Pie Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={100}> {/* Reduced height by half */}
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
                  `${value} (${total ? ((value / total) * 100).toFixed(1) : 0}%)`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Status Bars */}
        <div className="flex-1 flex flex-col justify-center">
          {pieData.map(s => {
            const width = total ? (s.value / total) * 100 : 0;
            return (
              <div key={s.name} className="mb-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">{s.name}</span>
                  <span className="font-bold">{s.value}</span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full">
                  <div
                    className="h-1 rounded-full"
                    style={{ width: `${width}%`, backgroundColor: s.color }}
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

export default DashboardPage;