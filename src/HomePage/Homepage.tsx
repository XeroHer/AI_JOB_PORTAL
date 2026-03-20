import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import AIJobs from "./AIRecommendation";
import JobPage from "./JobPage";
import HeroSection from "./HeroSection";
import Profile from "../JobSeeker/Profile/profile";
import FooterPage from "../Component/footerPage";

// Simple Card wrapper
function Card({ children }) {
  return <div className="bg-white rounded-xl shadow p-6">{children}</div>;
}

// Floating Back to Top Button
function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300); // show after 300px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 bg-gray-900 text-black px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 transition z-50"
    >
      ↑ Top
    </button>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-1 justify-center px-4 sm:px-6 lg:px-10 py-6 gap-6">
        {/* Main Column */}
        <main className="flex-1 max-w-5xl space-y-6 mt-16">
          <Card>
            <HeroSection />
          </Card>

          <Card>
            <JobPage />
          </Card>

          <Card>
            <AIJobs />
          </Card>
        </main>

        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-96 sticky top-24 h-fit space-y-6">
          <div className="bg-white rounded-xl shadow p-4">
            <Profile />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-lg mb-2">Career Tips</h3>
            <p className="text-sm text-gray-600">
              Complete your profile to increase job matches by 70%.
            </p>
          </div>
        </aside>
      </div>

      {/* Footer */}
      <FooterPage />

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
  );
}