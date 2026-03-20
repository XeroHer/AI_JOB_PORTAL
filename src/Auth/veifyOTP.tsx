// VerifyOtpPage.tsx
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // If you passed email from register page
  const initialEmail = (location.state as any)?.email || "";
  
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleVerifyOtp = async () => {
    if (!email || !otp) {
      setError("Please enter both email and OTP.");
      setMessage("");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp,
      });

      setMessage(response.data.message || "OTP verified successfully!");
      setError("");

      // Navigate to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed.");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-xl font-bold text-center mb-4">Verify Your Account</h2>
        <p className="text-center mb-6">
          Enter the OTP sent to your email to activate your account.
        </p>

        {/* Email Input */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 mb-4">
          <span className="mr-3 text-purple-600">✉️</span>
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent w-full outline-none text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* OTP Input */}
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-3 mb-4">
          <span className="mr-3 text-purple-600">🔑</span>
          <input
            type="text"
            placeholder="Enter OTP"
            className="bg-transparent w-full outline-none text-sm"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </div>

        {/* Messages */}
        {message && <p className="text-green-600 text-center mb-2">{message}</p>}
        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        {/* Verify Button */}
        <button
          onClick={handleVerifyOtp}
          className="w-full mt-4 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition"
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
}
