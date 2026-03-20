import { useEffect, useState } from "react";
import JobCard from "./jobcard";
import Pagination from "../Component/Pagination";




export default function JobPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const jobsPerPage = 6;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");

        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const startIndex = (currentPage - 1) * jobsPerPage;
  const currentJobs = jobs.slice(startIndex, startIndex + jobsPerPage);
  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <p className="px-10 py-16">Loading jobs...</p>;
  if (error) return <p className="px-10 py-16 text-red-500">{error}</p>;

  return (
    
    
    <section className="px-10 py-16 mt-6">
      
      <h2 className="text-2xl font-semibold mb-8">Featured Jobs</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentJobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </section>
   
   
  );
}