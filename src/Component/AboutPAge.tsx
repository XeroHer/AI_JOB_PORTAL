import { useEffect, useState } from "react";
import { FaBriefcase, FaUsers, FaBuilding, FaSearch, FaRobot, FaFileAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Navbar from "../HomePage/Navbar";
import FooterPage from "./footerPage";

export default function AboutPage() {
  const [jobs, setJobs] = useState(0);
  const [seekers, setSeekers] = useState(0);
  const [recruiters, setRecruiters] = useState(0);

  // Animate counters
  useEffect(() => {
    fetch("http://localhost:5000/api/jobs/statics", {
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const animate = (setter, target, duration = 2000) => {
          let start = 0;
          const step = Math.ceil(target / (duration / 50));
          const interval = setInterval(() => {
            start += step;
            if (start >= target) {
              start = target;
              clearInterval(interval);
            }
            setter(start);
          }, 50);
        };

        animate(setJobs, data.jobsCount);
        animate(setSeekers, data.jobSeekersCount);
        animate(setRecruiters, data.recruitersCount);
      })
      .catch((err) => console.error("Stats fetch error:", err));
  }, []);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 mt-12">
      <Navbar />

      {/* Hero */}
      <motion.section
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl font-bold mb-4">About JobAI</h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl">
          JobAI is an AI-powered job portal connecting talented job seekers with recruiters efficiently and intelligently.
        </p>
      </motion.section>

      {/* Mission */}
      <motion.section
        className="w-full py-14 px-6 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Simplifying job search and recruitment using AI-based recommendations,
          resume analysis, and a smart platform for both job seekers and recruiters.
        </p>
      </motion.section>

      {/* Features */}
      <motion.section
        className="w-full py-14 px-6 bg-gradient-to-r from-indigo-50 to-purple-50"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold text-center mb-10">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8 w-full px-6">
          {[
            { icon: FaSearch, title: "Smart Job Search", desc: "Search jobs with filters and AI-driven recommendations to match your skills." },
            { icon: FaRobot, title: "AI Recommendations", desc: "Receive personalized job recommendations based on your profile and skills." },
            { icon: FaFileAlt, title: "Resume Analyzer", desc: "Analyze and improve your resume to boost your hiring chances." },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition transform hover:-translate-y-2 text-center cursor-pointer"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <f.icon className="mx-auto text-indigo-600 text-4xl mb-4" />
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Job Seekers & Recruiters */}
      <motion.section
        className="w-full py-14 px-6 grid md:grid-cols-2 gap-12"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-600 flex items-center gap-2"><FaUsers /> Job Seekers</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Personalized AI job recommendations</li>
            <li>Smart job search and filters</li>
            <li>Resume insights and suggestions</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-600 flex items-center gap-2"><FaBuilding /> Recruiters</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Post and manage job openings</li>
            <li>Track applicants efficiently</li>
            <li>Dedicated recruiter dashboard</li>
          </ul>
        </div>
      </motion.section>

      {/* Statistics */}
      <motion.section
        className="w-full py-14 px-6 bg-indigo-50 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold mb-10">Platform Statistics</h2>
        <div className="grid md:grid-cols-3 gap-8 w-full px-6">
          <div>
            <FaBriefcase className="mx-auto text-indigo-600 text-5xl mb-2" />
            <div className="text-4xl font-bold text-indigo-600">{jobs.toLocaleString()}+</div>
            <p className="text-gray-600">Jobs Posted</p>
          </div>
          <div>
            <FaUsers className="mx-auto text-indigo-600 text-5xl mb-2" />
            <div className="text-4xl font-bold text-indigo-600">{seekers.toLocaleString()}+</div>
            <p className="text-gray-600">Job Seekers</p>
          </div>
          <div>
            <FaBuilding className="mx-auto text-indigo-600 text-5xl mb-2" />
            <div className="text-4xl font-bold text-indigo-600">{recruiters.toLocaleString()}+</div>
            <p className="text-gray-600">Recruiters</p>
          </div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        className="w-full py-14 px-6 text-center"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold mb-10">How It Works</h2>
        <div className="grid md:grid-cols-4 gap-8 text-center w-full px-6">
  {[
    { label: "Create Account", link: "register" },
    { label: "Complete Profile" },
    { label: "Find Jobs or Candidates" },
    { label: "Apply or Hire" }
  ].map((step, i) => (
    <div key={i}>
      <div className="text-indigo-600 text-3xl font-bold mb-2">{i + 1}</div>
      <p className="text-gray-600">
        {step.link ? <a href={step.link} className="text-blue-600 hover:underline">{step.label}</a> : step.label}
      </p>
    </div>
  ))}
</div>
      </motion.section>

      <FooterPage />
    </div>
  );
}