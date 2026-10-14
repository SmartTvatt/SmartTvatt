import { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Återställ profilen vid omladdning så appen vet vilken roll som är inloggad.
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (err) {
        console.error('Kunde inte läsa sparad användardata:', err);
        localStorage.removeItem('user');
      }
    }
    return null;
  });

  // Token skickas med API-anrop som kräver en inloggad användare.
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || null;
  });

  const login = (userData, userToken) => {
    // Uppdatera React-state och localStorage tillsammans så sessionen överlever omladdning.
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    // Rensa både minnet och den sparade sessionen när användaren loggar ut.
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};