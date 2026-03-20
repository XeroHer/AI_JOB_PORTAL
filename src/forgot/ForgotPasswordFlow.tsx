// ForgotPasswordFlow.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type Step = "EMAIL" | "OTP" | "RESET";

const ForgotPasswordFlow: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const API_BASE = "http://localhost:5000/api/auth";

  // OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Send password reset OTP
  const handleSendOtp = async () => {
    if (!email) return alert("Enter your email");
    try {
      const res = await axios.post(`${API_BASE}/password-reset/send-otp`, { email });
      setMessage(res.data.message);
      setSuccess(true);
      setStep("OTP");
      setResendTimer(60);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
      setSuccess(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      await axios.post(`${API_BASE}/password-reset/verify-otp`, { email, otp });
      setMessage("OTP verified. You can reset your password now.");
      setSuccess(true);
      setStep("RESET");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Invalid OTP");
      setSuccess(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    try {
      await axios.post(`${API_BASE}/password-reset/send-otp`, { email });
      setMessage("OTP resent!");
      setSuccess(true);
      setResendTimer(60);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to resend OTP");
      setSuccess(false);
    }
  };

  // Reset password
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) return alert("Enter passwords");
    if (newPassword !== confirmPassword) return alert("Passwords do not match");

    try {
      const res = await axios.post(`${API_BASE}/password-reset/reset`, {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Failed to reset password");
      setSuccess(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot Password</h2>

        {step === "EMAIL" && (
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full p-2 border rounded mb-4"
              placeholder="Enter your email"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === "OTP" && (
          <div>
            <label className="block mb-2 font-medium">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.trim())}
              maxLength={6}
              className="w-full p-2 border rounded mb-4"
              placeholder="6-digit OTP"
            />
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleVerifyOtp}
                className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
              >
                Verify OTP
              </button>
              <button
                onClick={handleResendOtp}
                disabled={resendTimer > 0}
                className={`text-blue-600 underline ${
                  resendTimer > 0 ? "disabled:text-gray-400" : ""
                }`}
              >
                {resendTimer > 0 ? `Resend OTP (${resendTimer}s)` : "Resend OTP"}
              </button>
            </div>
          </div>
        )}

        {step === "RESET" && (
          <div>
            <label className="block mb-2 font-medium">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Reset Password
            </button>
          </div>
        )}

        {message && (
          <p
            className={`text-center mt-4 ${success ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordFlow;