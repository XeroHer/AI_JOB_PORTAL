import { useState, useEffect, useRef } from "react";
import { FaCamera } from "react-icons/fa";
import RecruiterDashboard from "../../Component/recuiter";
import DashboardPage from "../../Component/jobseeker";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/jobs/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data);

        // Load photo from localStorage using userId
        const savedPhoto = localStorage.getItem(`profilePhoto_${data._id}`);

        if (savedPhoto) {
          setPhotoPreview(savedPhoto);
        } else {
          setPhotoPreview(
            data.photo ||
              `https://ui-avatars.com/api/?name=${data.name}&background=random`
          );
        }

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Failed to load profile");
      });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file || !profileData) return;

    if (file.size > 5000000) {
      alert("Image too large (max 5MB)");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Image = reader.result;

      // Save image in localStorage using userId
      localStorage.setItem(
        `profilePhoto_${profileData._id}`,
        base64Image
      );

      setPhotoPreview(base64Image);
    };

    reader.readAsDataURL(file);
  };

  if (loading)
    return (
      <p className="p-6 text-center text-gray-700">Loading...</p>
    );

  if (!profileData)
    return (
      <p className="p-6 text-center text-red-500">
        Please login to view your profile
      </p>
    );

  const userRole = profileData.role?.toLowerCase();

  return (
    <div className="min-h-screen bg-gray-100 ">

      {/* Cover */}
      <div
        className="relative h-40 bg-center bg-cover"
        style={{ backgroundImage: `url(${photoPreview})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200/70 to-yellow-100/70"></div>
      </div>

      {/* Profile Section */}
      <div className="bg-white px-6 py-6 shadow flex flex-col items-start">

        {/* Profile Image */}
        <div className="relative -mt-16 w-24">
          <img
            src={photoPreview}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow"
          />

          {/* Camera Overlay */}
          <div
            onClick={() => fileInputRef.current.click()}
            className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 hover:opacity-100 transition cursor-pointer"
          >
            <FaCamera className="text-white text-lg" />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Profile Info */}
        <h2 className="mt-2 text-xl font-semibold text-gray-800">
          {profileData.name} | {profileData.role}
        </h2>

        <p className="text-gray-700">{profileData.email}</p>
      </div>

      {/* Dashboard Based on Role */}
      <div className="p-0">
        {userRole === "jobseeker" ? (
          <DashboardPage />
        ) : userRole === "recruiter" ? (
          <RecruiterDashboard />
        ) : (
          <p className="text-red-500">Unknown role</p>
        )}
      </div>
    </div>
  );
}