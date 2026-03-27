// RegisterPage.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { WelcomePanel } from "./WelcomePanel";
import { SocialIcon } from "./socialicon";
import { Role } from "./Role";
import axios from "axios";
import zxcvbn from "zxcvbn";

export function RegisterPage() {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [passwordScore, setPasswordScore] = useState(0);

  const navigate = useNavigate();
  const passwordStrengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  const handleRegister = async () => {
    // Basic validation
    if (!role || !name || !email || !password) {
      alert("Please fill in all fields, including your role.");
      return;
    }

    if (!acceptedTerms) {
      alert("You must agree to the Terms & Conditions.");
      return;
    }

    // Password strength check
    if (passwordScore < 3) {
      alert(
        "Password is too weak. Try adding uppercase letters, numbers, and special characters."
      );
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        role,
        name,
        email,
        password,
      });

      setOtpMessage(
        "Account created! Please check your email for the OTP to verify your account."
      );

      setTimeout(() => {
        navigate("/verify-otp", { state: { email } });
      }, 1000);
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl">
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

                <div className="flex flex-col">
                  <div className="flex items-center bg-gray-100 rounded-full px-4 py-3">
                    <span className="mr-3 text-purple-600">🔒</span>
                    <input
                      value={password}
                      onChange={(e) => {
                        const newPass = e.target.value;
                        setPassword(newPass);
                        const result = zxcvbn(newPass);
                        setPasswordScore(result.score);
                      }}
                      type="password"
                      placeholder="Password"
                      className="bg-transparent w-full outline-none text-sm"
                    />
                  </div>
                  {/* Password strength meter */}
                  {password && (
                    <div className="mt-1 text-xs flex items-center justify-between">
                      <span className="text-gray-500">
                        Strength: {passwordStrengthText[passwordScore]}
                      </span>
                      <progress
                        value={passwordScore}
                        max={4}
                        className="w-24 h-2 rounded"
                      />
                    </div>
                  )}
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