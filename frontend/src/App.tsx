import './assets/css/index.css';
import './assets/css/asset.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Connect } from './pages/connect';
import { Profile } from './pages/profile';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { Complete_profile } from './pages/complete-profile';
import ChatAppPage from './pages/ChatAppPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'sonner';

import AppointmentPage from "./pages/appointment";
import MyAppointmentsPage from "./pages/my-appointments";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";

export function App() {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/chat" />} />

          {/* Public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Appointment routes (public hoặc protected tùy bạn) */}
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          <Route path="/my-appointments" element={<MyAppointmentsPage />} />
          <Route path="/chat" element={<ChatAppPage />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/complete-profile" element={<Complete_profile />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            {/* <Route path="/chat" element={<ChatAppPage />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/complete-profile" element={<Complete_profile />} /> */}
          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
