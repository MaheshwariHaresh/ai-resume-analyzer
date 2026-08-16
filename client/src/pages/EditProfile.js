import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Clock3,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../apis/userApi";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    profession: "",
    location: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Populate form with current user data
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
        profession: user.profession || "",
        location: user.location || "",
        experience: user.experience || "",
      });
    }
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Check whether anything changed
  const hasChanges = Object.keys(formData).some((key) => {
    const currentValue = (formData[key] || "").trim();
    const originalValue = (user?.[key] || "").trim();

    return currentValue !== originalValue;
  });

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const cleanedData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      profession: formData.profession.trim(),
      location: formData.location.trim(),
      experience: formData.experience.trim(),
    };

    // Required field
    if (!cleanedData.fullName) {
      setError("Full name is required.");
      return;
    }

    // Name validation
    if (cleanedData.fullName.length < 2) {
      setError("Full name must contain at least 2 characters.");
      return;
    }

    // Phone validation
    if (cleanedData.phone && !/^[+]?[\d\s()-]{7,20}$/.test(cleanedData.phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    // No changes
    if (!hasChanges) {
      setError("No changes were made to your profile.");
      return;
    }

    try {
      setLoading(true);

      const data = await updateProfile(cleanedData);

      if (data.success) {
        // Update AuthContext with latest user data
        login(data.user, data.token || localStorage.getItem("token"));

        setSuccess("Profile updated successfully.");

        setTimeout(() => {
          navigate("/dashboard/profile");
        }, 1000);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-gray-50 px-6 py-8 lg:px-10">
      <div className="max-w-5xl mx-auto">
        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-6 md:px-8 border-b border-gray-100">
            <div className="flex items-center gap-5">
              {/* Back Button */}
              <Link
                to="/dashboard/profile"
                className="w-10 h-10 shrink-0 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-100 transition"
                aria-label="Back to profile"
              >
                <ArrowLeft size={18} />
              </Link>

              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <User size={25} className="text-blue-600" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Keep your profile information up to date.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* Error */}
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-600">
                <CheckCircle size={18} className="mt-0.5 shrink-0" />

                <span>{success}</span>
              </div>
            )}

            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500 outline-none cursor-not-allowed"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Email address cannot be changed.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="+92 300 1234567"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Profession */}
                <div>
                  <label
                    htmlFor="profession"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Profession
                  </label>

                  <div className="relative">
                    <Briefcase
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="profession"
                      type="text"
                      name="profession"
                      value={formData.profession}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g. Backend Developer"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Location
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="location"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g. Karachi, Pakistan"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Experience
                  </label>

                  <div className="relative">
                    <Clock3
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="experience"
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g. 2 Years"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              {/* Cancel */}
              <Link
                to="/dashboard/profile"
                className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 text-sm font-semibold text-center hover:bg-gray-50 transition"
              >
                Cancel
              </Link>

              {/* Save */}
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto min-w-[160px] px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}

                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
