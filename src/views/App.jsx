import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard.jsx";
import AdminDaySchedule from "./AdminDaySchedule.jsx";
import BookingView from "./BookingView.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ändrad: Skickar användaren direkt till /login vid start */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/boka" element={<BookingView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:day" element={<AdminDaySchedule />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Fångar upp alla ogiltiga länkar och skickar till login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
