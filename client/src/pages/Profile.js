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

const Profile = () => {
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
          <div className="flex items-center gap-5 mb-8">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={42} className="text-blue-600" />
            </div>

            <div>
              <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Upload Photo
              </button>

              <p className="text-sm text-gray-500 mt-2">JPG, PNG • Max 2MB</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              icon={<User size={18} />}
              label="Full Name"
              placeholder="Haresh Kumar"
            />

            <Input
              icon={<Mail size={18} />}
              label="Email"
              placeholder="haresh@gmail.com"
            />

            <Input
              icon={<Phone size={18} />}
              label="Phone"
              placeholder="+92..."
            />

            <Input
              icon={<Briefcase size={18} />}
              label="Profession"
              placeholder="Backend Developer"
            />

            <Input
              icon={<MapPin size={18} />}
              label="Location"
              placeholder="Karachi"
            />

            <Input
              icon={<Briefcase size={18} />}
              label="Experience"
              placeholder="Fresher"
            />

            <Input
              icon={<FaLinkedin size={18} />}
              label="LinkedIn"
              placeholder="https://linkedin.com/in/..."
            />

            <Input
              icon={<FaGithub size={18} />}
              label="GitHub"
              placeholder="https://github.com/..."
            />
          </div>

          <div className="mt-6">
            <label className="font-medium mb-2 block">Portfolio Website</label>

            <div className="flex items-center border rounded-xl px-4">
              <Globe size={18} className="text-gray-500" />

              <input
                type="text"
                placeholder="https://portfolio.com"
                className="w-full p-3 outline-none"
              />
            </div>
          </div>

          <button className="mt-8 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
            <Save size={18} />
            Save Changes
          </button>
        </div>

        {/* Right */}

        <div className="space-y-6">
          {/* Stats */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5">Account Statistics</h2>

            <Stat
              icon={<FileText size={18} />}
              title="Resume Analyses"
              value="12"
            />

            <Stat
              icon={<BarChart3 size={18} />}
              title="Average ATS"
              value="84%"
            />

            <Stat
              icon={<Brain size={18} />}
              title="Interview Sessions"
              value="18"
            />

            <Stat
              icon={<Calendar size={18} />}
              title="Member Since"
              value="2026"
            />
          </div>

          {/* Account */}

          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h2 className="font-bold text-lg mb-5">Account Settings</h2>

            <button className="w-full flex items-center gap-3 border rounded-xl p-4 hover:bg-gray-50">
              <Lock size={18} />
              Change Password
            </button>

            <button className="w-full mt-4 flex items-center gap-3 border border-red-200 text-red-600 rounded-xl p-4 hover:bg-red-50">
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Input = ({ icon, label, placeholder }) => (
  <div>
    <label className="font-medium mb-2 block">{label}</label>

    <div className="flex items-center border rounded-xl px-4">
      <div className="text-gray-500">{icon}</div>

      <input
        type="text"
        placeholder={placeholder}
        className="w-full p-3 outline-none"
      />
    </div>
  </div>
);

const Stat = ({ icon, title, value }) => (
  <div className="flex justify-between items-center py-3 border-b last:border-none">
    <div className="flex items-center gap-3">
      <div className="text-blue-600">{icon}</div>

      <span>{title}</span>
    </div>

    <span className="font-bold">{value}</span>
  </div>
);

export default Profile;
