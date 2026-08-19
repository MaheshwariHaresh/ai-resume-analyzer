import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, googleLoginUser } from "../apis/authApi";
import { useAuth } from "../context/AuthContext";

import {
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaFileAlt,
  FaChartLine,
  FaRobot,
} from "react-icons/fa";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [agree, setAgree] = useState(false);

  /*
   * Google Login
   */
  const handleGoogleLogin = async (response) => {
    try {
      setGoogleLoading(true);
      setError("");

      if (!response?.credential) {
        throw new Error("Google authentication failed.");
      }

      const data = await googleLoginUser(response.credential);

      if (!data.success || !data.accessToken || !data.user) {
        throw new Error("Invalid Google login response from server.");
      }

      /*
       * Reuse existing authentication flow.
       */
      login(data.user, data.accessToken);

      navigate("/dashboard");
    } catch (error) {
      console.error("Google Registration Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to continue with Google.",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  /*
   * Initialize Google Identity Services.
   */
  useEffect(() => {
    if (!window.google) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
   * Open Google authentication.
   */
  const handleGoogleButtonClick = () => {
    if (!window.google) {
      setError("Google Sign-In is not available. Please try again.");
      return;
    }

    setError("");

    window.google.accounts.id.prompt();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) {
      setError("");
    }
  };

  /*
   * Email/password registration.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.password.trim() ||
      !agree
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const data = await registerUser(payload);

      if (data.success) {
        login(data.user, data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());

  const isFormValid =
    formData.fullName.trim() &&
    formData.email.trim() &&
    isValidEmail &&
    formData.password.trim() &&
    agree;

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
              Create your free account and unlock AI-powered resume analysis,
              ATS scoring and interview preparation.
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
                <span className="text-lg">Save Unlimited Resume Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-14 flex items-center">
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-4xl font-bold text-gray-800">
              Create Account 🚀
            </h2>

            <p className="text-gray-500 mt-3">
              Start analyzing resumes with AI in seconds.
            </p>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleButtonClick}
              disabled={googleLoading || loading}
              className="group relative w-full mt-8 h-14 overflow-hidden rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {/* Subtle hover background */}
              <span className="absolute inset-0 bg-gradient-to-r from-blue-50/0 via-blue-50/60 to-indigo-50/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <span className="relative flex items-center justify-center gap-3">
                {googleLoading ? (
                  <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
                ) : (
                  <>
                    {/* Google Icon */}
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
                      <FaGoogle className="text-[17px] text-red-600" />
                    </span>

                    <span className="text-[15px] font-semibold text-gray-700 tracking-tight">
                      Continue with Google
                    </span>
                  </>
                )}
              </span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-200" />

              <span className="text-gray-400 text-xs font-medium">OR</span>

              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Full Name */}
            <label className="block mb-2 font-medium text-gray-700">
              Full Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <label className="block mt-5 mb-2 font-medium text-gray-700">
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
            <label className="block mt-5 mb-2 font-medium text-gray-700">
              Password
            </label>

            <div className="relative">
              <FaLock className="absolute left-4 top-4 text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password"
                autoComplete="new-password"
                className="w-full border rounded-xl py-3 pl-12 pr-12 outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 mt-5 text-gray-600 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => {
                  setAgree(e.target.checked);

                  if (error) {
                    setError("");
                  }
                }}
                className="mt-1 cursor-pointer"
              />

              <span>I agree to the Terms of Service and Privacy Policy.</span>
            </label>

            {/* Error */}
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            {/* Register */}
            <button
              type="submit"
              disabled={!isFormValid || loading || googleLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-semibold mt-8 transition flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login */}
            <p className="text-center mt-8 text-gray-600">
              Already have an account?
              <Link
                to="/login"
                className="ml-2 text-blue-600 font-semibold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
