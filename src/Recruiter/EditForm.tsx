import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

const EditJobForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [job, setJob] = useState({
    company: "",
    title: "",
    summary: "",
    location: "",
    workMode: "",
    employmentType: "",
    salaryMin: "",
    salaryMax: "",
    description: "",
    skills: [],
    experience: "",
  });

  const [skillInput, setSkillInput] = useState("");

  // Fetch existing job
  useEffect(() => {
    const fetchJob = async () => {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch job");
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("Fetch job error:", err.message);
        alert("Error fetching job: " + err.message);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const skill = skillInput.trim();
    if (skill && !job.skills.includes(skill)) {
      setJob((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setJob((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update a job");
      return;
    }

    if (job.salaryMin && job.salaryMax && Number(job.salaryMin) > Number(job.salaryMax)) {
      alert("Min salary cannot be greater than Max salary");
      return;
    }

    if (!job.skills.length) {
      alert("Please add at least one skill");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/jobs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(job),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg || "Failed to update job");
      }

      alert("Job updated successfully!");
      navigate("/recuiter/jobs");
    } catch (err) {
      console.error("Update job error:", err.message);
      alert("Error updating job: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex justify-center items-start py-8 px-4 md:px-16">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center md:text-left">
          Edit Job
        </h2>

        <input
          required
          name="company"
          value={job.company}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        <input
          required
          name="title"
          value={job.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        <textarea
          required
          name="summary"
          value={job.summary}
          onChange={handleChange}
          placeholder="Short job summary (1–2 lines)"
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        <input
          name="location"
          value={job.location}
          onChange={handleChange}
          placeholder="Location (e.g., Remote, New York)"
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        <div className="flex flex-col md:flex-row gap-4">
          <select
            name="workMode"
            value={job.workMode}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            required
          >
            <option value="">Work Mode</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
            <option value="onsite">On-site</option>
          </select>

          <select
            name="employmentType"
            value={job.employmentType}
            onChange={handleChange}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            required
          >
            <option value="">Employment Type</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
            <option value="internship">Internship</option>
          </select>
        </div>

        <div className="flex gap-4">
          <input
            type="number"
            name="salaryMin"
            value={job.salaryMin}
            onChange={handleChange}
            placeholder="Min Salary"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="number"
            name="salaryMax"
            value={job.salaryMax}
            onChange={handleChange}
            placeholder="Max Salary"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2"
          />
        </div>

        <textarea
          required
          name="description"
          value={job.description}
          onChange={handleChange}
          placeholder="Full job description"
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />

        {/* Skills */}
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            {job.skills.map((skill, i) => (
              <span
                key={i}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddSkill(e);
              }}
              placeholder="Add skill"
              className="flex-1 border border-gray-300 rounded-md px-3 py-2"
            />
            <button
              onClick={handleAddSkill}
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Add
            </button>
          </div>
        </div>

        <select
          name="experience"
          value={job.experience}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
          required
        >
          <option value="">Experience Level</option>
          <option value="entry">Entry</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md font-medium text-white ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
          }`}
        >
          {loading ? "Updating..." : "Update Job"}
        </button>
      </form>
    </div>
  );
};

export default EditJobForm;