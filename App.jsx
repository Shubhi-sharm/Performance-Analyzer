import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoginPage from "./pages/Login.jsx";
import RegisterPage from "./pages/Register.jsx";
import DashboardPage from "./pages/Dashboard.jsx";
import StartInterviewPage from "./pages/StartInterview.jsx";
import InterviewPage from "./pages/Interview.jsx";
import ReportPage from "./pages/Report.jsx";
import HistoryPage from "./pages/History.jsx";
import SettingsPage from "./pages/Settings.jsx";
import ProfilePage from "./pages/Profile.jsx";
import ATSPage from "./pages/ATS.jsx";
import AtsReportPage from "./pages/AtsReport.jsx";
import AppShell from "./components/AppShell.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell>
              <DashboardPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/start"
        element={
          <ProtectedRoute>
            <AppShell>
              <StartInterviewPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ats"
        element={
          <ProtectedRoute>
            <AppShell>
              <ATSPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ats/report/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <AtsReportPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppShell>
              <HistoryPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <AppShell>
              <SettingsPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppShell>
              <ProfilePage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/interview/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <InterviewPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/report/:id"
        element={
          <ProtectedRoute>
            <AppShell>
              <ReportPage />
            </AppShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
