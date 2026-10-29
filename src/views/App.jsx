import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminDaySchedule from "./AdminDaySchedule.jsx";
import BookingView from "./BookingView.jsx";
import Dashboard from "./Dashboard.jsx";
import ForgotPassword from "./ForgotPassword.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import ResetPassword from "./ResetPassword.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Öppna rutter */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* Skyddade rutter – kräver inloggning */}
        <Route element={<ProtectedRoute />}>
          {/* Startsidan skickar inloggade direkt till Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boka" element={<BookingView />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/:day" element={<AdminDaySchedule />} />
        </Route>

        {/* Fångar alla okända adresser och skickar till start */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
