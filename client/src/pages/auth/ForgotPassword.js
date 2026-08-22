import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  Loader2,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../../apis/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const data = await forgotPassword(email.trim());

      setSuccess(
        data?.message ||
          "If an account exists with this email, a password reset link has been sent.",
      );
    } catch (error) {
      console.error("Forgot Password Error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to process your request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center">
              <LockKeyhole className="text-white" size={22} />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">
              Resume<span className="text-blue-600">AI</span>
            </h1>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Mail className="text-blue-600" size={26} />
            </div>

            <h2 className="mt-5 text-2xl font-bold text-gray-900">
              Forgot Password?
            </h2>

            <p className="mt-2 text-sm text-gray-500 leading-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2
                  size={19}
                  className="text-green-600 mt-0.5 shrink-0"
                />

                <div>
                  <p className="text-sm font-semibold text-green-700">
                    Check your email
                  </p>

                  <p className="text-sm text-green-600 mt-1 leading-5">
                    {success}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          {!success && (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    disabled={loading}
                    className="w-full border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    Send Reset Link
                    <Mail size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Back */}
          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
