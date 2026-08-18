import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./routes/ProtectedRoute";

import DashboardLayout from "./layout/DashboardLayout";
import GuestRoute from "./routes/GuestRoute";

import PublicResumeResult from "./pages/PublicResumeResult";
import Dashboard from "./pages/Dashboard";
import ResumeHistory from "./pages/ResumeHistory";
import InterviewCoach from "./pages/InterviewCoach";
import Profile from "./pages/Profile";

import { Routes, Route } from "react-router-dom";
import AnalyzeResume from "./pages/AnalyzeResume";
import ResumeDetails from "./pages/ResumeDetails";
import InterviewSession from "./pages/InterviewSession";
import InterviewResult from "./pages/InterviewResult";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <Routes>
      {/* Guest Routes */}

      <Route element={<GuestRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resume-analysis" element={<PublicResumeResult />} />
      </Route>

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
        <Route path="interview/:sessionId" element={<InterviewSession />} />
        <Route
          path="interview/session/:sessionId"
          element={<InterviewSession />}
        />

        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="analyze" element={<AnalyzeResume />} />
        <Route path="resume/:id" element={<ResumeDetails />} />
        <Route
          path="interview/result/:sessionId"
          element={<InterviewResult />}
        />
      </Route>
    </Routes>
  );
}

export default App;
