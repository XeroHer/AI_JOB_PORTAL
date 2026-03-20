import { useState } from "react";
import { SocialIcon } from "./socialicon";
import { Role } from "./Role";
import { Link, useNavigate } from "react-router-dom";
import { WelcomePanel } from "./WelcomePanel";


export function LoginPage() {
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {  email: email.trim().toLowerCase(),
  password: password.trim(), };

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Login failed");
      }

      const data = await res.json();

      if (!data.user || !data.token) throw new Error("Invalid server response");

      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("role", data.user.role);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      {/* Centered content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 [] w-full max-w-6xl">
          
          {/* LEFT – Welcome Panel */}
          <WelcomePanel />

          {/* RIGHT – Login Form */}
          <div className="flex items-center justify-center bg-gray-100 rounded-r-3xl p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
              <h2 className="text-center text-black text-lg font-semibold mb-2">
                Sign in to Job Portal
              </h2>
              <p className="text-center text-gray-600 text-sm mb-6">
                Welcome back! Please login to your account.
              </p>

              <Role role={role} setRole={setRole} />

              <div className="mb-6">
                <SocialIcon role={role} />
              </div>

              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="px-3 text-xs text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full border-b border-gray-300 focus:border-purple-500 outline-none py-1 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full border-b border-gray-300 focus:border-purple-500 outline-none py-1 text-sm"
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <p className="text-xs text-red-500 text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 rounded-md text-white text-sm font-medium
                             bg-gradient-to-r from-purple-500 to-orange-400
                             hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Login"}
                </button>

                <p className="text-center text-gray-700 text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="text-purple-600 hover:underline">
                    Sign up
                  </Link>
                </p>
              </form>

              <p className="text-[10px] text-center text-gray-400 mt-6">
                By signing in, you agree to{" "}
                <a href="/terms" className="underline hover:text-gray-600">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="/privacy" className="underline hover:text-gray-600">
                  Privacy Policy
                </a>
              </p>

              <div className="mt-5 text-center">
                <h3 className="text-black text-sm">Secured by 👤 Admin</h3>
                <p className="text-xs text-white mt-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 inline-block">
                  Development Mode by Bikesh
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

     
    </div>
  );
}