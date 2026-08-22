import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./routes/ProtectedRoute";
import GuestRoute from "./routes/GuestRoute";

import DashboardLayout from "./layout/DashboardLayout";

import PublicResumeResult from "./pages/PublicResumeResult";
import Dashboard from "./pages/Dashboard";
import ResumeHistory from "./pages/ResumeHistory";
import InterviewCoach from "./pages/InterviewCoach";
import Profile from "./pages/Profile";
import AnalyzeResume from "./pages/AnalyzeResume";
import ResumeDetails from "./pages/ResumeDetails";
import InterviewSession from "./pages/InterviewSession";
import InterviewResult from "./pages/InterviewResult";
import EditProfile from "./pages/EditProfile";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      {/* ==================== PUblic Routes ==================== */}
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* ==================== Guest Routes ==================== */}

      <Route element={<GuestRoute />}>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/resume-analysis" element={<PublicResumeResult />} />
      </Route>

      {/* ==================== Protected Dashboard ==================== */}

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
