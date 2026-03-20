import React, { useState } from "react";
import Pagination from "../Component/Pagination";

const statusBadge = (status) => {
  switch (status) {
    case "shortlisted":
    case "shortlist":
      return "text-green-600";
    case "rejected":
    case "reject":
      return "text-red-600";
    case "accepted":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

const normalizeStatus = (status) => {
  if (status === "shortlist") return "shortlisted";
  if (status === "reject") return "rejected";
  return status;
};

const ApplicantsTable = ({ applicants = [], onStatusChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const applicantsPerPage = 5;
  const totalPages = Math.ceil(applicants.length / applicantsPerPage);
  const startIndex = (currentPage - 1) * applicantsPerPage;

  const currentApplicants = applicants.slice(
    startIndex,
    startIndex + applicantsPerPage
  );

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Job Title</th>
              <th className="border p-2">Resume</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentApplicants.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No applicants found
                </td>
              </tr>
            ) : (
              currentApplicants.map((app) => {
                const status = normalizeStatus(app.status);

                return (
                  <tr key={app._id} className="text-center">
                    <td className="border p-2">{app.name}</td>
                    <td className="border p-2">{app.email}</td>
                    <td className="border p-2">
                      {app.jobId?.title || "N/A"}
                    </td>

                    <td className="border p-2">
                      {app.resumePath ? (
                        <a
                          href={`http://localhost:5000/${app.resumePath}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          {app.resumeOriginalName || "View"}
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>

                    <td className={`border p-2 font-semibold ${statusBadge(status)}`}>
                      {status}
                    </td>

                    <td className="border p-2 space-x-2">
                      {status === "pending" ? (
                        <>
                          <button
                            onClick={() => onStatusChange(app._id, "shortlist")}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Shortlist
                          </button>

                          <button
                            onClick={() => onStatusChange(app._id, "reject")}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {currentApplicants.length === 0 ? (
          <p className="text-center text-gray-500">No applicants found</p>
        ) : (
          currentApplicants.map((app) => {
            const status = normalizeStatus(app.status);

            return (
              <div
                key={app._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <h3 className="font-semibold text-lg">{app.name}</h3>

                <p className="text-sm text-gray-600">{app.email}</p>

                <p className="mt-1 text-sm">
                  <span className="font-semibold">Job:</span>{" "}
                  {app.jobId?.title || "N/A"}
                </p>

                <p
                  className={`mt-1 text-sm font-semibold ${statusBadge(status)}`}
                >
                  Status: {status}
                </p>

                <div className="mt-2">
                  {app.resumePath ? (
                    <a
                      href={`http://localhost:5000/${app.resumePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline text-sm"
                    >
                      View Resume
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">No Resume</span>
                  )}
                </div>

                {status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onStatusChange(app._id, "shortlist")}
                      className="flex-1 bg-green-500 text-white py-1 rounded"
                    >
                      Shortlist
                    </button>

                    <button
                      onClick={() => onStatusChange(app._id, "reject")}
                      className="flex-1 bg-red-500 text-white py-1 rounded"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
      )}
    </>
  );
};

export default ApplicantsTable;