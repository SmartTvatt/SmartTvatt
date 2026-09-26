import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importera vyerna
import Dashboard from "../views/Dashboard";
import BookingView from "../views/BookingView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Startsidan */}
        <Route path="/" element={<Dashboard />} />

        {/* Bokningssidan */}
        <Route path="/boka" element={<BookingView />} />
      </Routes>
    </BrowserRouter>
  );
}
