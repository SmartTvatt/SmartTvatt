import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.svg';

export default function Register() {
  // Hook för att kunna navigera tillbaka till /login
  const navigate = useNavigate();

  // State-objekt för alla fyra formulärfält
  const [formData, setFormData] = useState({
    name: '',
    apartmentNumber: '',
    email: '',
    password: '',
  });

  // Funktion som dynamiskt uppdaterar rätt fält i state när användaren skriver
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Funktion som körs när registreringsformuläret skickas
  const handleSubmit = (e) => {
    e.preventDefault(); // Förhindrar att sidan laddas om
    navigate('/');
    //alert(`Registreringsförsök för: ${formData.name}`);
    // Här kopplas backend-anropet (POST /api/auth/register) på senare
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
      
      {/* Själva registreringskortet */}
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
          <h2 style={{ fontSize: '18px', margin: '0', color: '#111827' }}>Skapa konto</h2>
        </div>

        {/* Registreringsformulär */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Namn-fält */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
              Namn och efternamn
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange} // Anropar handleChange som uppdaterar formData.name
              placeholder="Förnamn Efternamn"
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

          {/* Lägenhetsnummer-fält */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
              Lägenhetsnummer
            </label>
            <input
              type="text"
              name="apartmentNumber"
              required
              value={formData.apartmentNumber}
              onChange={handleChange} // Anropar handleChange som uppdaterar formData.apartmentNumber
              placeholder="t.ex. Lgh 1202"
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

          {/* E-postfält */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
              E-postadress
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange} // Anropar handleChange som uppdaterar formData.email
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
              name="password"
              required
              value={formData.password}
              onChange={handleChange} // Anropar handleChange som uppdaterar formData.password
              placeholder="Minst 6 tecken"
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

          {/* Registrera-knapp */}
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
            Skapa konto
          </button>
        </form>

        {/* Länk tillbaka till Login */}
        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
          <span>Har du redan ett konto? </span>
          <button
            type="button"
            onClick={() => navigate('/login')} // Navigerar till /login vid klick
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
            Logga in här
          </button>
        </div>

      </div>
    </div>
  );
}