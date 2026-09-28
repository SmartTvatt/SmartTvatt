import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importera vyerna
import Dashboard from "../views/Dashboard";
import BookingView from "../views/BookingView";
import AdminDashboard from "../views/AdminDashboard";
import AdminDaySchedule from "../views/AdminDaySchedule";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Startsidan */}
        <Route path="/" element={<Dashboard />} />

        {/* Bokningssidan */}
        <Route path="/boka" element={<BookingView />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/:day" element={<AdminDaySchedule />} />
      </Routes>
    </BrowserRouter>
  );
}
