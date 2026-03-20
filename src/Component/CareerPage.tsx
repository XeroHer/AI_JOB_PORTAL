import { useEffect, useState } from "react";

const CareersPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Replace with your real API endpoint
        const response = await fetch("/api/jobs"); 
        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-6">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <img src="/WhatsApp Image 2026-03-13 at 15.22.44.png" className="h-6" alt="JobAI Logo" />
          Careers at JobAI
        </div>
        <p className="text-gray-300 mt-2">
          Join our team and help us revolutionize job matching with AI.
        </p>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10 max-w-5xl mx-auto space-y-10">

        {/* Company Culture */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Culture</h2>
          <p className="text-gray-700">
            At JobAI, we value innovation, collaboration, and continuous learning. We strive to create a supportive environment where every team member can thrive and make an impact.
          </p>
        </section>

        {/* Open Positions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Open Positions</h2>

          {loading ? (
            <p className="text-gray-500">Loading jobs...</p>
          ) : jobs.length === 0 ? (
            <p className="text-gray-500 font-medium">
              Currently we do not have any open positions. Please check back soon!
            </p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <a
                  key={job.id}
                  href={`/careers/${job.slug}`}
                  className="block bg-white p-4 rounded shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    <span className="text-gray-500">{job.type}</span>
                  </div>
                  <p className="text-gray-600 mt-1">{job.location}</p>
                </a>
              ))}
            </div>
          )}
        </section>

        {/* How to Apply */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">How to Apply</h2>
          <p className="text-gray-700 mb-4">
            Click on any position above to see the full job description and submit your application. Make sure to include your CV and a brief cover letter highlighting your experience and motivation.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            Contact HR
          </a>
        </section>

      </main>
    </div>
  );
};

export default CareersPage;