import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import userAvatar from "../assets/user-avatar.jpg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter your username and password");
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password);
      toast.success("Logged in successfully");
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while logging in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="ltr"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 px-4"
    >
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={userAvatar} alt="Admin" className="w-28 h-28 rounded-full object-cover drop-shadow-md mb-3" />
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">Library Management System</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-semibold mt-1">Admin Login</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-7"
        >
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm border border-red-100 dark:bg-red-900/30 dark:text-red-300 dark:border-red-900">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-base font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Username
            </label>
            <div className="relative">
              <FiUser className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400" size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-base font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute top-1/2 -translate-y-1/2 left-3.5 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute top-1/2 -translate-y-1/2 right-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
}
