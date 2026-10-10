import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.svg';

export default function Login() {
  // States för formulärdata, felmeddelanden och laddningsstatus
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Context för global inloggning och router för navigering
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hanterar inloggningsanropet mot backenden på port 5001
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setErrorMessage(data.message || 'Felaktiga inloggningsuppgifter');
      }
    } catch (err) {
      console.error('Inloggningsfel:', err);
      setErrorMessage('Kunde inte ansluta till servern. Kontrollera att backenden körs på port 5001.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Huvudcontainer som centrerar kortet på skärmen
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      {/* Inloggningskort */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        color: '#111827',
        textAlign: 'left',
      }}>
        {/* Logotyp och rubriker */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <img
            src={logo}
            alt="SmartTvätt Logotyp"
            style={{
              height: '75px',
              width: 'auto',
              display: 'block',
              margin: '0 auto 12px auto',
            }}
          />
          <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', color: '#111827' }}>SmartTvätt</h1>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6B7280' }}>Din tvättstuga, enklare</p>
          <h2 style={{ fontSize: '18px', margin: '0', color: '#111827' }}>Välkommen tillbaka</h2>
        </div>

        {/* Felmeddelande-box vid misslyckad inloggning */}
        {errorMessage && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: '#FEE2E2',
            color: '#DC2626',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            {errorMessage}
          </div>
        )}

        {/* Inloggningsformulär */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
              E-postadress
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="namn@brf.se"
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#F9FAFB',
                color: '#111827',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
              Lösenord
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#F9FAFB',
                color: '#111827',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1F6B56',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>

        {/* Navigationslänk till registrering */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
          <span>Inget konto ännu? </span>
          <button
            type="button"
            onClick={() => navigate('/register')}
            style={{
              background: 'none',
              border: 'none',
              color: '#1F6B56',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
            }}
          >
            Skapa konto här
          </button>
        </div>
      </div>
    </div>
  );
}