import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  BarChart3,
  FileText,
  Brain,
  Calendar,
  Lock,
  Trash2,
  Pencil,
  ExternalLink,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyProfile, changePassword, deleteAccount } from "../apis/userApi";

import Stat from "../components/utils/Stat";
import ChangePasswordModal from "../components/utils/ChangePasswordModal";
import DeleteAccountModal from "../components/utils/DeleteAccountModal";

/* =================================================
   PROFILE SKELETON
================================================= */

const ProfileSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Profile Hero */}
      <div className="relative overflow-hidden bg-gray-200 rounded-3xl p-7 md:p-9">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 shrink-0 rounded-2xl bg-gray-300" />

          {/* User Info */}
          <div className="space-y-3 flex-1">
            <div className="h-4 w-28 bg-gray-300 rounded" />
            <div className="h-8 w-56 bg-gray-300 rounded" />

            <div className="flex gap-5">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-4 w-28 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="h-5 w-48 bg-gray-200 rounded" />
            <div className="h-4 w-72 bg-gray-100 rounded mt-2" />
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-gray-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-32 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <div className="h-10 w-32 bg-gray-200 rounded-lg" />
          </div>
        </div>

        {/* Account Statistics */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="h-5 w-44 bg-gray-200 rounded" />
            <div className="h-4 w-52 bg-gray-100 rounded mt-2" />
          </div>

          <div className="p-6 space-y-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-28 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-300 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="h-5 w-40 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-100 rounded mt-2" />
        </div>

        <div className="p-6 space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-200" />

                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                  <div className="h-3 w-48 bg-gray-100 rounded" />
                </div>
              </div>

              <div className="w-5 h-5 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* =================================================
   PROFILE
================================================= */

const Profile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    location: "",
    experience: "",
  });

  const [statistics, setStatistics] = useState({
    resumeAnalyses: 0,
    averageATS: 0,
    interviewSessions: 0,
    memberSince: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Password states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Delete account states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  /* =================================================
     FETCH PROFILE
  ================================================= */

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
        });

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

  /* =================================================
     CHANGE PASSWORD
  ================================================= */

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
      console.error("Change Password Error:", error);

      setPasswordError(
        error.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  /* =================================================
     DELETE ACCOUNT
  ================================================= */

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError("");

      await deleteAccount();

      /*
       * AuthContext should normally handle authentication
       * cleanup. Remove old token key as a safety fallback.
       */
      localStorage.removeItem("token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

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

  /* =================================================
     LOADING STATE
  ================================================= */

  if (loading) {
    return <ProfileSkeleton />;
  }

  /* =================================================
     ERROR STATE
  ================================================= */

  if (error && !profile.email) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-2xl p-8 text-center max-w-md w-full">
          <p className="text-red-500 text-sm">{error}</p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /* =================================================
     INITIALS
  ================================================= */

  const initials = profile.fullName
    ? profile.fullName
        .split(" ")
        .filter(Boolean)
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* =================================================
          PROFILE HERO
      ================================================= */}

      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-600 to-indigo-700 rounded-3xl p-7 md:p-9 text-white shadow-lg">
        {/* Background Decoration */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

        <div className="absolute -bottom-32 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 shrink-0 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-lg">
            <span className="text-3xl font-bold text-white">{initials}</span>
          </div>

          {/* User Info */}
          <div className="min-w-0">
            <p className="text-sm font-medium text-blue-100">Career Profile</p>

            <h2 className="mt-1 text-3xl font-bold truncate">
              {profile.fullName || "User"}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-blue-100">
              {profile.profession && (
                <span className="flex items-center gap-2">
                  <Briefcase size={15} />
                  {profile.profession}
                </span>
              )}

              {profile.location && (
                <span className="flex items-center gap-2">
                  <MapPin size={15} />
                  {profile.location}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          MAIN GRID
      ================================================= */}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Personal Information */}

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Personal Information
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your basic account and contact information.
            </p>
          </div>

          <div className="p-6 grid sm:grid-cols-2 gap-5">
            <InfoItem
              icon={<User size={18} />}
              label="Full Name"
              value={profile.fullName}
            />

            <InfoItem
              icon={<Mail size={18} />}
              label="Email Address"
              value={profile.email}
            />

            <InfoItem
              icon={<Phone size={18} />}
              label="Phone"
              value={profile.phone}
            />

            <InfoItem
              icon={<MapPin size={18} />}
              label="Location"
              value={profile.location}
            />

            <InfoItem
              icon={<Briefcase size={18} />}
              label="Profession"
              value={profile.profession}
            />

            <InfoItem
              icon={<Briefcase size={18} />}
              label="Experience"
              value={profile.experience}
            />
          </div>

          {/* Edit Profile */}

          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard/profile/edit")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Account Statistics */}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              Account Statistics
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Your activity overview.
            </p>
          </div>

          <div className="p-6">
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
        </div>
      </div>

      {/* =================================================
          ACCOUNT SETTINGS
      ================================================= */}

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage your account security and access.
          </p>
        </div>

        <div className="p-6 space-y-3">
          {/* Change Password */}

          <button
            type="button"
            onClick={() => {
              setShowPasswordModal(true);
              setPasswordError("");
              setPasswordSuccess("");
            }}
            className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50/50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock size={18} />
              </div>

              <div>
                <p className="font-semibold text-sm text-gray-900">
                  Change Password
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Update your account password.
                </p>
              </div>
            </div>

            <ExternalLink size={17} className="text-gray-400" />
          </button>

          {/* Delete Account */}

          <button
            type="button"
            onClick={() => {
              setDeleteError("");
              setShowDeleteModal(true);
            }}
            className="w-full flex items-center justify-between gap-4 p-4 rounded-xl border border-red-100 hover:border-red-200 hover:bg-red-50 transition text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 size={18} />
              </div>

              <div>
                <p className="font-semibold text-sm text-red-600">
                  Delete Account
                </p>

                <p className="text-xs text-gray-500 mt-0.5">
                  Permanently delete your account and data.
                </p>
              </div>
            </div>

            <ExternalLink size={17} className="text-red-300" />
          </button>
        </div>
      </div>

      {/* =================================================
          PASSWORD MODAL
      ================================================= */}

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

      {/* =================================================
          DELETE ACCOUNT MODAL
      ================================================= */}

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

/* =================================================
   INFO ITEM
================================================= */

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-gray-200 text-blue-600 flex items-center justify-center">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-gray-900 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
};

export default Profile;
