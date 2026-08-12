import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  Globe,
  Save,
  BarChart3,
  FileText,
  Brain,
  Calendar,
  Lock,
  Trash2,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyProfile,
  updateMyProfile,
  changePassword,
  deleteAccount,
} from "../apis/userApi";
import Input from "../components/utils/Input";
import Stat from "../components/utils/Stat";
import ChangePasswordModal from "../components/utils/ChangePasswordModal";
import DeleteAccountModal from "../components/utils/DeleteAccountModal";

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    location: "",
    experience: "",
    linkedin: "",
    github: "",
    portfolio: "",
  });

  const [statistics, setStatistics] = useState({
    resumeAnalyses: 0,
    averageATS: 0,
    interviewSessions: 0,
    memberSince: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Password Change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Delete Account States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  // Fetch Profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyProfile();

        const { user } = response.data;

        setProfile({
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          profession: user.profession || "",
          location: user.location || "",
          experience: user.experience || "",
          linkedin: user.linkedin || "",
          github: user.github || "",
          portfolio: user.portfolio || "",
        });

        // Statistics will be added when backend returns them.
        if (response.data.statistics) {
          setStatistics(response.data.statistics);
        }
      } catch (error) {
        console.error("Get Profile Error:", error);

        setError(error.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setPasswordLoading(true);
      setPasswordError("");
      setPasswordSuccess("");

      if (!currentPassword || !newPassword) {
        setPasswordError("Both password fields are required.");
        return;
      }

      if (newPassword.length < 6) {
        setPasswordError("New password must be at least 6 characters long.");
        return;
      }

      await changePassword(currentPassword, newPassword);

      setPasswordSuccess("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");

      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAccount();

      // Clear authentication
      localStorage.removeItem("token");

      // Redirect to login
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Delete Account Error:", error);

      setDeleteError(
        error.response?.data?.message || "Failed to delete account.",
      );
    } finally {
      setDeleteLoading(false);
    }
  };
  // Save Profile
  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await updateMyProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        profession: profile.profession,
        location: profile.location,
        experience: profile.experience,
        linkedin: profile.linkedin,
        github: profile.github,
        portfolio: profile.portfolio,
      });

      const user = response.data;

      setProfile((prev) => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || prev.email,
        phone: user.phone || "",
        profession: user.profession || "",
        location: user.location || "",
        experience: user.experience || "",
        linkedin: user.linkedin || "",
        github: user.github || "",
        portfolio: user.portfolio || "",
      }));

      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("Update Profile Error:", error);

      setError(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error && !profile.email) {
    return (
      <div className="bg-white border rounded-2xl p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>

        <p className="text-gray-500 mt-2">
          Manage your profile, account settings and career information.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left */}

        <div className="lg:col-span-2 bg-white rounded-2xl border shadow-sm p-8">
          {/* Profile Image */}

          <div className="flex items-center gap-5 mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={42} className="text-blue-600" />
              )}
            </div>

            <div>
              <button
                type="button"
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Upload Photo
              </button>

              <p className="text-sm text-gray-500 mt-2">JPG, PNG • Max 2MB</p>
            </div>
          </div>

          {/* Profile Fields */}

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              icon={<User size={18} />}
              label="Full Name"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              placeholder="Full Name"
            />

            <Input
              icon={<Mail size={18} />}
              label="Email"
              name="email"
              value={profile.email}
              placeholder="Email"
              disabled
            />

            <Input
              icon={<Phone size={18} />}
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="+92..."
            />

            <Input
              icon={<Briefcase size={18} />}
              label="Profession"
              name="profession"
              value={profile.profession}
              onChange={handleChange}
              placeholder="Backend Developer"
            />

            <Input
              icon={<MapPin size={18} />}
              label="Location"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Karachi"
            />

            <Input
              icon={<Briefcase size={18} />}
              label="Experience"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              placeholder="Fresher"
            />

            <Input
              icon={<FaLinkedin size={18} />}
              label="LinkedIn"
              name="linkedin"
              value={profile.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/..."
            />

            <Input
              icon={<FaGithub size={18} />}
              label="GitHub"
              name="github"
              value={profile.github}
              onChange={handleChange}
              placeholder="https://github.com/..."
            />
          </div>

          {/* Portfolio */}

          <div className="mt-6">
            <label className="font-medium mb-2 block">Portfolio Website</label>

            <div className="flex items-center border rounded-xl px-4">
              <Globe size={18} className="text-gray-500" />

              <input
                type="text"
                name="portfolio"
                value={profile.portfolio}
                onChange={handleChange}
                placeholder="https://portfolio.com"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          {/* Messages */}

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

          {success && <p className="mt-4 text-sm text-green-600">{success}</p>}

          {/* Save */}

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl"
          >
            <Save size={18} />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Right */}

        <div className="space-y-6">
          {/* Statistics */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5">Account Statistics</h2>

            <Stat
              icon={<FileText size={18} />}
              title="Resume Analyses"
              value={statistics.resumeAnalyses}
            />

            <Stat
              icon={<BarChart3 size={18} />}
              title="Average ATS"
              value={`${statistics.averageATS}%`}
            />

            <Stat
              icon={<Brain size={18} />}
              title="Interview Sessions"
              value={statistics.interviewSessions}
            />

            <Stat
              icon={<Calendar size={18} />}
              title="Member Since"
              value={
                statistics.memberSince
                  ? new Date(statistics.memberSince).getFullYear()
                  : "-"
              }
            />
          </div>

          {/* Account Settings */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5">Account Settings</h2>

            <button
              type="button"
              onClick={() => {
                setShowPasswordModal(true);
                setPasswordError("");
                setPasswordSuccess("");
              }}
              className="w-full flex items-center gap-3 border rounded-xl p-4 hover:bg-gray-50"
            >
              <Lock size={18} />
              Change Password
            </button>

            <button
              type="button"
              onClick={() => {
                setDeleteError("");
                setShowDeleteModal(true);
              }}
              className="w-full mt-4 flex items-center gap-3 border border-red-200 text-red-600 rounded-xl p-4 hover:bg-red-50"
            >
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>

          {showPasswordModal && (
            <ChangePasswordModal
              currentPassword={currentPassword}
              newPassword={newPassword}
              setCurrentPassword={setCurrentPassword}
              setNewPassword={setNewPassword}
              onSubmit={handleChangePassword}
              onClose={() => setShowPasswordModal(false)}
              loading={passwordLoading}
              error={passwordError}
              success={passwordSuccess}
            />
          )}
        </div>
      </div>
      {showDeleteModal && (
        <DeleteAccountModal
          onDelete={handleDeleteAccount}
          onClose={() => setShowDeleteModal(false)}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </div>
  );
};

export default Profile;
