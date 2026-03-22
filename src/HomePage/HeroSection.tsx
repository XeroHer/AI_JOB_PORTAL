import { useState } from "react";
import { Search } from "lucide-react";
import JobCard from "./jobcard";

export default function Herosection() {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchJobs = async () => {
    if (!title.trim() && !location.trim()) {
      setJobs([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();

      if (title.trim()) params.append("title", title.trim());
      if (location.trim()) params.append("location", location.trim());

      const res = await fetch(
       `${import.meta.env.VITE_API_URL}/api/jobs?${params.toString()}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await res.json();
      setJobs(Array.isArray(data.jobs) ? data.jobs : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Something went wrong. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col items-center px-4 sm:px-6 py-16 sm:py-20 bg-gray-100">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        Find Your Dream Job with AI
      </h1>

      <p className="text-gray-600 mb-8 text-center text-sm sm:text-base">
        Smart job matching powered by AI
      </p>

      {/* Search Bar */}
      <div className="bg-white shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row gap-3 w-full max-w-3xl mb-6">
        
        <input
          className="w-full border rounded-xl px-4 py-2"
          placeholder="Skills / Job Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
        />

        <input
          className="w-full border rounded-xl px-4 py-2"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
        />

        <button
          onClick={fetchJobs}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border hover:bg-gray-100 w-full sm:w-auto"
        >
          <Search size={18} className="text-gray-500" />
          <span className="sm:hidden">Search</span>
        </button>
      </div>

      {/* Results */}
      <div className="w-full max-w-4xl">
        {loading && (
          <p className="text-center text-gray-500">Loading jobs...</p>
        )}

        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && jobs.length === 0 && (title || location) && (
          <p className="text-center text-gray-500">No jobs found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {jobs.slice(0, 6).map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}