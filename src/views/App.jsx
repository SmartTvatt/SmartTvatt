import { BrowserRouter, Route, Routes } from "react-router-dom";
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
        <Route path="/" element={<Dashboard />} />
        <Route path="/boka" element={<BookingView />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:day" element={<AdminDaySchedule />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
