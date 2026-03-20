import React, { useEffect, useState, useCallback } from "react";
import Sidebar from "./Sidebar";

import DashboardStats from "./DashboardStats";
import { useNavigate } from "react-router-dom";
import Navbar1 from "./Navbar";

const API_BASE = "http://localhost:5000/api";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([
    { title: "Jobs Posted", value: 0, path: "/recuiter/jobs" },
    { title: "Total Applicants", value: 0, path: "/recruiter/applicants" },
    { title: "Shortlisted Candidates", value: 0, path: "/recruiter/shortlisted" },
  ]);

  const [loadingStats, setLoadingStats] = useState(true);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [avatar, setAvatar] = useState("/avatar.png");

  // Sidebar open/close state for mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  // Load user info and avatar
  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user") || "null") ||
      JSON.parse(sessionStorage.getItem("user") || "null");

    if (storedUser?.name) {
      setUserName(storedUser.name);
      setFirstName(storedUser.name.split(" ")[0]);
    }

    const savedAvatar = localStorage.getItem("avatar");
    if (savedAvatar) setAvatar(savedAvatar);
  }, []);

  // Handle avatar upload
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setAvatar(imageData);
      localStorage.setItem("avatar", imageData);
    };
    reader.readAsDataURL(file);
  };

  // Fetch stats
  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setLoadingStats(true);
    try {
      const resJobs = await fetch(`${API_BASE}/jobs/recruiter/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataJobs = await resJobs.json();

      const resApplicants = await fetch(`${API_BASE}/jobs/recruiter/applicants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataApplicants = await resApplicants.json();

      const shortlistedCount = dataApplicants.filter(app => app.status === "shortlist").length;

      setStats([
        { title: "Jobs Posted", value: dataJobs.count || 0, path: "/recuiter/jobs" },
        { title: "Total Applicants", value: dataApplicants.length, path: "/recruiter/applicants" },
        { title: "Shortlisted Candidates", value: shortlistedCount, path: "/recuiter" },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStats(false);
    }
  }, [navigate]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  return (
    <div className="w-screen flex min-h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} userName={userName} />
      <div className="flex-1 p-6 space-y-6">
        <Navbar1
          firstName={firstName}
          avatar={avatar}
          onAvatarChange={handleAvatarChange}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        {loadingStats ? <p>Loading stats...</p> : <DashboardStats stats={stats} />}
      </div>
    </div>
  );
};

export default RecruiterDashboard;