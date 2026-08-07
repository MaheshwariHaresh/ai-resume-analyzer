import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import ResumeHistory from "./pages/ResumeHistory";
import InterviewCoach from "./pages/InterviewCoach";
import Profile from "./pages/Profile";

import { Routes, Route } from "react-router-dom";
import AnalyzeResume from "./pages/AnalyzeResume";

function App() {
  return (
    <Routes>
      {/* Public */}

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        <Route path="history" element={<ResumeHistory />} />

        <Route path="interview" element={<InterviewCoach />} />

        <Route path="profile" element={<Profile />} />
        <Route path="analyze" element={<AnalyzeResume />} />
      </Route>
    </Routes>
  );
}

export default App;
