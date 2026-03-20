// RegisterPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WelcomePanel } from "./WelcomePanel";
import { SocialIcon } from "./socialicon";
import { Role } from "./Role";
import axios from "axios";

export function RegisterPage() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    // Frontend validation
    if (!role || !name || !email || !password) {
      alert("Please fill in all fields, including your role.");
      return;
    }

    if (!acceptedTerms) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    try {
      // Send registration request
      await axios.post("http://localhost:5000/api/auth/register", {
        role,
        name,
        email,
        password,
      });

      // Show OTP message
      setOtpMessage(
        "Account created! Please check your email for the OTP to verify your account."
      );

      // Redirect to OTP verification page after 2 seconds
      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1000);

    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 [] w-full max-w-6xl">
      
      {/* LEFT – Welcome Panel */}
      <WelcomePanel role={role} setRole={setRole} />

      {/* RIGHT – Registration Form */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 rounded-r-3xl">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-x font-bold text-center">Create your account</h2>
          <p className="text-center mb-4">
            Welcome! Please fill in these details to get started
          </p>

          {/* Role Selector */}
          <Role role={role} setRole={setRole} />
          {!role && <p className="text-red-500 text-xs mt-1">Please select a role</p>}

          {/* Social Login */}
          <p className="text-center mb-3">or login with</p>
          <SocialIcon role={role} />

          {/* Input Fields */}
          <div className="space-y-5">
            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
              <span className="mr-3 text-purple-600">👤</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Full Name"
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
              <span className="mr-3 text-purple-600">✉️</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>

            <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
              <span className="mr-3 text-purple-600">🔒</span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="bg-transparent w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-5">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            />
            <span>
              I agree to{" "}
              <Link to="/terms" className="text-purple-600 underline">
                Terms & Conditions
              </Link>
            </span>
          </div>
          {!acceptedTerms && <p className="text-red-500 text-xs mt-1">You must accept terms</p>}

          {/* OTP Message */}
          {otpMessage && (
            <p className="text-green-600 text-center mt-4">{otpMessage}</p>
          )}

          {/* Sign Up Button */}
          <button
            onClick={handleRegister}
            disabled={!role || !acceptedTerms}
            className={`w-full mt-6 py-3 rounded-full text-white font-semibold ${
              !role || !acceptedTerms
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition"
            }`}
          >
            CREATE ACCOUNT
          </button>

          {/* Footer */}
          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-600 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
}
