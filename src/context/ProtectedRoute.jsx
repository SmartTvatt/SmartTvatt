import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);

  // Om användaren saknar token (oinloggad) skickas de till inloggningen
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};