import { Bell, Search } from "lucide-react";

const Topbar = () => {
  return (
    <header className="bg-white border-b h-20 px-8 flex items-center justify-between">
      {/* Search */}

      <div className="relative w-96">
        <Search size={18} className="absolute left-4 top-3.5 text-gray-400" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full border rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Right */}

      <div className="flex items-center gap-6">
        <button className="relative">
          <Bell size={22} />

          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-11 h-11 rounded-full"
          />

          <div>
            <h4 className="font-semibold">Haresh Kumar</h4>

            <p className="text-sm text-gray-500">Backend Developer</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
