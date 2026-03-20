import { useNavigate } from "react-router-dom";
import { RequireLogin } from "../../proctedRoute/RequireLogin";

export default function JobCard({ job }) {
  const navigate = useNavigate();
  if (!job) return null;

  return (
    <div className="border rounded-2xl p-6 hover:shadow-md transition shadow-sm">
      <h3 className="font-semibold mb-2 text-lg">{job.title}</h3>

      <p className="text-sm text-gray-600 mb-1">{job.company}</p>
      <p className="text-sm text-gray-600 mb-4">{job.location}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {job.skills?.map((skill, idx) => (
          <span
            key={idx}
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
          >
            {skill}
          </span>
        ))}
      </div>
      
      <RequireLogin>
      <button
        onClick={() => navigate(`/jobs/${job._id}`)}
        className="w-full px-4 py-2 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white hover:bg-blue-700 transition"
      >
        View Job
      </button>
      </RequireLogin>
    </div>
  );
}
