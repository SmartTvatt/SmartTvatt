import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Login() {
  // Hook från react-router-dom för att navigeras mellan sidor utan sidladdning
  const navigate = useNavigate();

  // State-variabler för att spara det användaren skriver i formuläret
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Funktion som körs när inloggningsformuläret skickas
  const handleSubmit = (e) => {
    e.preventDefault(); // Förhindrar standardbeteendet att sidan laddas om
    navigate('/');
    //alert(`Inloggningsförsök med: ${email}`);
    // Här kopplas backend-anropet (POST /api/auth/login) på senare
  };

  return (
    /* Yttre container: Täcker hela skärmen (100vh), tvingar vit bakgrund och centrerar kortet */
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#ffffff',       // Tvingar hela sidans bakgrund att vara vit
      display: 'flex',
      alignItems: 'center',             // Vertikal centrering
      justifyContent: 'center',          // Horisontell centrering
      padding: '20px'
    }}>
      
      {/* Själva inloggningskortet */}
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '32px',
        backgroundColor: '#ffffff',     // Vit bakgrund på själva kortet
        borderRadius: '24px',           // Rundade hörn
        border: '1px solid #E5E7EB',     // Ljusgrå ram
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)', // Mjuk skugga
        color: '#111827',               // Mörk textfärg för god läsbarhet
        textAlign: 'left'
      }}>
        
        {/* Logotyp och Rubriker */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>

          {/* SmartTvätts maskotlogotyp */}
          <img 
            src={logo} 
            alt="SmartTvätt Logotyp" 
            style={{
              height: '75px',
              width: 'auto',
              display: 'block',
              margin: '0 auto 12px auto'
            }} 
        />
          <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', color: '#111827' }}>SmartTvätt</h1>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6B7280' }}>Din tvättstuga, enklare</p>
          <h2 style={{ fontSize: '18px', margin: '0', color: '#111827' }}>Välkommen tillbaka</h2>
        </div>

        {/* Inloggningsformulär */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* E-postfält */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
              E-postadress
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Uppdaterar state vid inmatning
              placeholder="namn@brf.se"
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#F9FAFB',
                color: '#111827',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Lösenordsfält */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
              Lösenord
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)} // Uppdaterar state vid inmatning
              placeholder="••••••••"
              style={{
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #D1D5DB',
                backgroundColor: '#F9FAFB',
                color: '#111827',
                fontSize: '14px',
                outline: 'none'
              }}
            />
          </div>

          {/* Logga in-knapp */}
          <button
            type="submit"
            style={{
              marginTop: '8px',
              padding: '12px',
              borderRadius: '12px',
              border: 'none',
              backgroundColor: '#1F6B56', // Projektets gröna knappfärg
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Logga in
          </button>
        </form>

        {/* Länk till registrering */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
          <span>Inget konto ännu? </span>
          <button
            type="button"
            onClick={() => navigate('/register')} // Navigerar till /register vid klick
            style={{
              background: 'none',
              border: 'none',
              color: '#1F6B56',
              fontWeight: '600',
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            Skapa konto här
          </button>
        </div>

      </div>
    </div>
  );
}