import { useEffect, useState } from "react";
import Pagination from "../Component/Pagination";

interface Application {
  _id: string;
 
  status: string;
  createdAt: string;
  jobId?: {
    _id: string;
    title: string;
    company: string;
  };
}

export default function Applications() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 10;

  // Pagination calculations
  const totalPages = Math.ceil(apps.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentApps = apps.slice(startIndex, startIndex + jobsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please log in.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/jobs/applications", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to fetch applications");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setApps(data);
        else setApps([]);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Loading applications...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="w-screen p-4 sm:p-6 lg:px-60">
      <h1 className="text-xl sm:text-2xl font-semibold mb-6">
        My Applications
      </h1>

      {apps.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full border-collapse border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left text-xs sm:text-sm">
                    Company
                  </th>
                  <th className="border p-2 text-left text-xs sm:text-sm">
                    Applied On
                  </th>
                  <th className="border p-2 text-left text-xs sm:text-sm">
                    Application ID
                  </th>
                  <th className="border p-2 text-left text-xs sm:text-sm">
                    Job Title
                  </th>
                  <th className="border p-2 text-left text-xs sm:text-sm">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentApps.map((app) => {
                  const status = app.status?.toLowerCase();

                  const statusColor =
                    status === "shortlist"
                      ? "text-green-500"
                      : status === "reject"
                      ? "text-red-500"
                      : "text-yellow-500";

                  return (
                    <tr key={app._id} className="border hover:bg-gray-50">
                      <td className="border p-2 font-mono text-xs sm:text-sm">
                        {app.jobId?.company}
                      </td>

                      <td className="border p-2 text-xs sm:text-sm">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      <td className="border p-2 font-mono text-xs sm:text-sm">
                        {app._id}
                      </td>

                      <td className="border p-2 text-xs sm:text-sm">
                        {app.jobId?.title || "N/A"}
                      </td>

                      <td className="border p-2 text-xs sm:text-sm">
                        <span className={`font-medium ${statusColor}`}>
                          {status?.toUpperCase() || "PENDING"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </>
      )}
    </div>
  );
}