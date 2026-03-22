import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function UpdateProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Fetch profile on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/jobs/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Handle basic field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle nested array changes
  const handleArrayChange = (field: string, index: number, key: string, value: string) => {
    const updatedArray = [...(profileData[field] || [])];
    updatedArray[index] = { ...updatedArray[index], [key]: value };
    setProfileData((prev: any) => ({ ...prev, [field]: updatedArray }));
  };

  const handleAddItem = (field: string, newItem: any = {}) => {
    setProfileData((prev: any) => ({
      ...prev,
      [field]: [...(prev[field] || []), newItem],
    }));
  };

  const handleRemoveItem = (field: string, index: number) => {
    const updatedArray = [...(profileData[field] || [])];
    updatedArray.splice(index, 1);
    setProfileData((prev: any) => ({ ...prev, [field]: updatedArray }));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setResumeFile(e.target.files[0]);
  };

  // Submit updated profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update your profile.");
      setSaving(false);
      return;
    }

    try {
      const formData = new FormData();

      // Basic fields
      ["name", "title", "location", "email", "phone", "summary"].forEach((key) => {
        formData.append(key, profileData[key] || "");
      });

      // Skills as comma-separated string
      formData.append("skills", (profileData.skills || []).join(","));

      // Nested arrays as JSON
      ["experience", "education", "projects", "certifications"].forEach((key) => {
        if (profileData[key]) formData.append(key, JSON.stringify(profileData[key]));
      });

      // Resume
      if (resumeFile) formData.append("resume", resumeFile);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }, // DO NOT set Content-Type manually
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Server response:", errorData);
        throw new Error(errorData.message || "Failed to update profile");
      }

      const data = await res.json();
      alert(data.message);
      setProfileData(data.user);
      setResumeFile(null);
    } catch (err: any) {
      console.error(err);
      alert("Error updating profile: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!profileData) return <p className="p-6">No profile data found</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Update Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={profileData.name || ""}
                onChange={handleChange}
                placeholder="Full Name"
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                name="title"
                value={profileData.title || ""}
                onChange={handleChange}
                placeholder="Role / Job Title"
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                name="location"
                value={profileData.location || ""}
                onChange={handleChange}
                placeholder="Location"
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="email"
                name="email"
                value={profileData.email || ""}
                onChange={handleChange}
                placeholder="Email"
                className="border rounded px-3 py-2 w-full"
              />
              <input
                type="text"
                name="phone"
                value={profileData.phone || ""}
                onChange={handleChange}
                placeholder="Phone"
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            {/* Summary */}
            <textarea
              name="summary"
              value={profileData.summary || ""}
              onChange={handleChange}
              placeholder="Summary"
              className="border rounded px-3 py-2 w-full"
              rows={4}
            />

            {/* Skills */}
            <div>
              <label className="font-semibold mb-2 block">Skills</label>
              {profileData.skills?.map((skill: string, index: number) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => {
                      const updatedSkills = [...(profileData.skills || [])];
                      updatedSkills[index] = e.target.value;
                      setProfileData((prev: any) => ({ ...prev, skills: updatedSkills }));
                    }}
                    className="border rounded px-3 py-2 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem("skills", index)}
                    className="bg-red-500 text-white px-3 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddItem("skills", "")}
                className="bg-green-500 text-white px-3 py-1 rounded mt-2"
              >
                Add Skill
              </button>
            </div>

            {/* Experience, Projects, Certifications, Education */}
            {["experience", "projects", "certifications", "education"].map((field) => {
              const templates: any = {
                experience: { role: "", company: "", duration: "", description: "" },
                projects: { name: "", description: "", link: "" },
                certifications: { title: "", issuer: "", year: "" },
                education: { degree: "", institution: "", year: "" },
              };
              const inputs: any = {
                experience: ["role", "company", "duration", "description"],
                projects: ["name", "description", "link"],
                certifications: ["title", "issuer", "year"],
                education: ["degree", "institution", "year"],
              };
              return (
                <SectionEditor
                  key={field}
                  field={field}
                  data={profileData[field]}
                  handleArrayChange={handleArrayChange}
                  handleAddItem={handleAddItem}
                  handleRemoveItem={handleRemoveItem}
                  template={templates[field]}
                  title={field.charAt(0).toUpperCase() + field.slice(1)}
                  inputs={inputs[field]}
                />
              );
            })}

            {/* Resume */}
            <div>
              <label className="font-semibold mb-2 block">Resume</label>
              {profileData.resume?.file && (
                <p className="text-gray-600 mb-2">
                  Current File:{" "}
                  <a
                    href={profileData.resume.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {profileData.resume.originalName || profileData.resume.file}
                  </a>
                </p>
              )}
              <input type="file" onChange={handleResumeChange} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {saving ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

// Reusable Section Editor
function SectionEditor({ field, data, handleArrayChange, handleAddItem, handleRemoveItem, template, title, inputs }: any) {
  return (
    <div className="mt-4">
      <label className="font-semibold mb-2 block">{title}</label>
      {data?.map((item: any, index: number) => (
        <div key={index} className="border p-3 rounded mb-2 space-y-2">
          {inputs.map((key: string) =>
            key === "description" ? (
              <textarea
                key={key}
                placeholder={key}
                value={item[key] || ""}
                onChange={(e) => handleArrayChange(field, index, key, e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            ) : (
              <input
                key={key}
                type="text"
                placeholder={key}
                value={item[key] || ""}
                onChange={(e) => handleArrayChange(field, index, key, e.target.value)}
                className="border rounded px-3 py-2 w-full"
              />
            )
          )}
          <button
            type="button"
            onClick={() => handleRemoveItem(field, index)}
            className="bg-red-500 text-white px-3 rounded"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => handleAddItem(field, template)}
        className="bg-green-500 text-white px-3 py-1 rounded mt-2"
      >
        Add {title.slice(0, -1)}
      </button>
    </div>
  );
}