import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../apis/authApi.js";
import { useAuth } from "../context/AuthContext.js";

import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaFileAlt,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if form is invalid
    if (!formData.email.trim() || !formData.password.trim()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await loginUser(formData);

      if (data.success) {
        login(data.user, data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to sign in. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error when user starts correcting the form
    if (error) {
      setError("");
    }
  };

  // Basic email validation
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  const isFormValid =
    formData.email.trim() && formData.password.trim() && isValidEmail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-16">
          <div>
            <h1 className="text-5xl font-bold leading-tight">
              AI Resume
              <br />
              Analyzer
            </h1>

            <p className="mt-6 text-blue-100 text-lg leading-8">
              Optimize your resume with AI, improve your ATS score, identify
              missing skills and practice interviews.
            </p>

            <div className="mt-12 space-y-6">
              <div className="flex items-center gap-4">
                <FaChartLine className="text-2xl" />
                <span className="text-lg">AI Powered ATS Score</span>
              </div>

              <div className="flex items-center gap-4">
                <FaRobot className="text-2xl" />
                <span className="text-lg">AI Interview Coach</span>
              </div>

              <div className="flex items-center gap-4">
                <FaFileAlt className="text-2xl" />
                <span className="text-lg">Resume Improvement Suggestions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-14 flex items-center">
          <form className="w-full" onSubmit={handleSubmit}>
            <h2 className="text-4xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-3">
              Sign in to continue your AI resume journey.
            </p>

            {/* Google */}
            <button
              type="button"
              className="w-full mt-8 flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 hover:bg-gray-50 transition"
            >
              <FaGoogle className="text-red-500 text-lg" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-300" />

              <span className="text-gray-400 text-sm">OR</span>

              <div className="flex-1 h-px bg-gray-300" />
            </div>

            {/* Email */}
            <label className="block mb-2 font-medium text-gray-700">
              Email Address
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-4 text-gray-400" />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <label className="block mt-6 mb-2 font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Error */}
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            {/* Remember / Forgot */}
            <div className="flex justify-between items-center mt-5">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="text-blue-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold mt-8 transition flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>

            {/* Register */}
            <p className="text-center mt-8 text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="ml-2 text-blue-600 font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
