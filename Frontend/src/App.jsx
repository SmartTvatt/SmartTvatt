import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importera vyerna
import Dashboard from "../views/Dashboard";
import BookingView from "../views/BookingView";
import Login from './components/Login';
import Register from "./components/Register"; // Importera Register

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Startsidan */}
        <Route path="/" element={<Dashboard />} />

        {/* Bokningssidan */}
        <Route path="/boka" element={<BookingView />} />

        {/* Inloggningssidan */}
        <Route path="/login" element={<Login />} />

        {/* Registreringssidan */}
        <Route path="/register" element={<Register />} /> 
      </Routes>
    </BrowserRouter>
  );
}
