// import { BrowserRouter, Route, Routes } from "react-router";
// import SignInPage from "./pages/SignInPage";
// import ChatAppPage from "./pages/ChatAppPage";
// import { Toaster } from "sonner";
// import SignUpPage from "./pages/SignUpPage";
// import ProtectedRoute from "./components/auth/ProtectedRoute";

// function App() {
//   return (
//     <>
//       <Toaster richColors />
//       <BrowserRouter>
//         <Routes>
//           {/* public routes */}
//           <Route
//             path="/signin"
//             element={<SignInPage />}
//           />
//           <Route
//             path="/signup"
//             element={<SignUpPage />}
//           />

//           {/* protectect routes */}
//           <Route element={<ProtectedRoute />}>
//             <Route
//               path="/"
//               element={<ChatAppPage />}
//             />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;
// import "leaflet/dist/leaflet.css";
// import React from "react";
// import AppointmentPage from "./pages/appointment";

// const App: React.FC = () => {
//   return <AppointmentPage />;
// };

// export default App;


import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppointmentPage from "./pages/appointment";
import MyAppointmentsPage from "./pages/my-appointments";
import AdminAppointmentsPage from "./pages/admin/AdminAppointmentsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppointmentPage />} />
        <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
        <Route path="/my-appointments" element={<MyAppointmentsPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


// Code mới
// import './assets/css/index.css';
// import './assets/css/asset.css';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
// import { Connect } from './pages/connect';
// import { Profile } from './pages/profile';
// import { Sign_in } from './pages/sign-in';
// import { Sign_up } from './pages/sign-up';
// import { Complete_profile } from './pages/complete-profile';
// import { Appointment } from './pages/appointment';
// import { Chat } from './pages/chat';

// export function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/sign-in" />} />

//         <Route path="/appointment" element={<Appointment />} />
//         <Route path="/chat" element={<Chat />} />
//         <Route path="/connect" element={<Connect />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/sign-in" element={<Sign_in />} />
//         <Route path="/sign-up" element={<Sign_up />} />
//         <Route path="/complete-profile" element={<Complete_profile />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
