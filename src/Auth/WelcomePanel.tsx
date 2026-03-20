import { useState } from "react";
import { Role } from "./Role";
import { SocialIcon } from "./socialicon";

export function WelcomePanel({role, setRole}) {
  
  return (
    <>
      {/* LEFT – Welcome Panel (Desktop Only) */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-10 rounded-l-3xl">
        <div className="text-center max-w-sm ">
          <h2 className="text-3xl font-semibold mb-4 mt-50px">
            Welcome! to AI Job Portal
          </h2>
          <p className="text-sm text-blue-100 mb-10">
            {role === "recruiter"
              ? "Join as a recruiter and discover top talent with AI-driven matching."
              : "Join our community and find your dream job with AI-powered recommendations."}
          </p>

          <p className="text-xs tracking-widest text-blue-200 mb-4 mt-50 ">
            ____ CONNECT WITH US ____
          </p>
          <Role role={role} setRole={setRole} />

          {/* Social Login */}
          <SocialIcon role={role} />
        </div>
      </div>
    </>
  );
}
