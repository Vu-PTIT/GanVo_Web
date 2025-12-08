import './assets/css/index.css';
import './assets/css/asset.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Connect } from './pages/user/connect';
import { Profile } from './pages/user/profile';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { Complete_profile } from './pages/user/complete-profile';
import ChatAppPage from './pages/user/ChatAppPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RequireAdmin from './components/auth/RequireAdmin';
import { Toaster } from 'sonner';
import { useAuthStore } from './stores/useAuthStore';

import AppointmentPage from "./pages/user/appointment";
import MyAppointmentsPage from "./pages/user/my-appointments";
import OtherAppointmentsPage from "./pages/user/other-appointments";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import DashboardPage from "./pages/user/DashboardPage";

export function App() {
  const { accessToken, refresh } = useAuthStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Auto-refresh token on app mount (after F5)
  useEffect(() => {
    const init = async () => {
      if (!accessToken) {
        console.log("🔄 No access token found, attempting to refresh from cookie...");
        try {
          await refresh();
          console.log("✅ Token refreshed successfully");
        } catch (error) {
          console.log("❌ Failed to refresh token:", error);
        }
      }
      setIsCheckingAuth(false);
    };
    init();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route
            path="/admin/appointments"
            element={
              <RequireAdmin fallback={<Navigate to="/chat" replace />}>
                <AdminAppointmentsPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RequireAdmin fallback={<Navigate to="/chat" replace />}>
                <AdminUsersPage />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RequireAdmin fallback={<Navigate to="/chat" replace />}>
                <AdminDashboardPage />
              </RequireAdmin>
            }
          />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/other-appointments" element={<OtherAppointmentsPage />} />
          <Route path="/chat" element={<ChatAppPage />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/complete-profile" element={<Complete_profile />} />
          <Route element={<ProtectedRoute />}>
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
