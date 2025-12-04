import './assets/css/index.css';
import './assets/css/asset.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { Connect } from './pages/connect';
import { Profile } from './pages/profile';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import { Complete_profile } from './pages/complete-profile';
;
import ChatAppPage from './pages/ChatAppPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'sonner';

export function App() {
  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/signin" />} />

          {/* Public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            
            <Route path="/chat" element={<ChatAppPage />} />
            <Route path="/connect" element={<Connect />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/complete-profile" element={<Complete_profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
