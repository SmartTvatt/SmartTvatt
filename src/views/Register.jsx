import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import logo from '../assets/logo.svg';

export default function Register() {
  // Hook för att kunna navigera tillbaka till /login
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State för felmeddelanden
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // State-objekt för alla fyra formulärfält
  const [formData, setFormData] = useState({
    name: '',
    apartmentNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Funktion som dynamiskt uppdaterar rätt fält i state när användaren skriver
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Funktion som körs när registreringsformuläret skickas
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { name, email, password, confirmPassword, apartmentNumber } = formData;

    // 1. Klientsidsvalidering
    if (!email.includes('@')) {
      setErrorMessage(t('auth.invalidEmail') || 'Ange en giltig e-postadress.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t('auth.passwordTooShort') || 'Lösenordet måste vara minst 6 tecken.');
      return;
    }

    // 2. Kontrollera att lösenorden matchar
    if (password !== confirmPassword) {
      setErrorMessage(t('auth.passwordsDoNotMatch') || 'Lösenorden matchar inte.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, apartmentNumber }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok) {
        throw new Error(data.message || 'Det gick inte att skapa kontot');
      }

      setSuccessMessage('Konto skapat! Omdirigerar till inloggning...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);

    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

 return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Språkväljare */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #E5E7EB',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          color: '#111827',
          textAlign: 'left'
        }}>
          {/* Logotyp och Rubriker */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
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
            <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', color: '#111827' }}>{t('common.appName')}</h1>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6B7280' }}>{t('common.tagline')}</p>
            <h2 style={{ fontSize: '18px', margin: '0', color: '#111827' }}>{t('auth.createAccount')}</h2>
          </div>

          {/* Error meddelande */}  
          {errorMessage && (
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '13px',
              marginBottom: '16px',
              border: '1px solid #FCA5A5'
            }}>
              {errorMessage}
            </div>
          )}

          {/* Framgångsmeddelande */}
          {successMessage && (
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              fontSize: '13px',
              marginBottom: '16px',
              border: '1px solid #6EE7B7'
            }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Namn-fält */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                {t('auth.nameLabel')}
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder={t('auth.namePlaceholder') || 'Förnamn Efternamn'}
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
                {t('auth.apartmentNumberLabel') || 'Lägenhetsnummer'}
              </label>
              <input
                type="text"
                name="apartmentNumber"
                required
                value={formData.apartmentNumber}
                onChange={handleChange}
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
                {t('auth.emailLabel')}
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.emailPlaceholder')}
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
                {t('auth.passwordLabel')}
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
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

            {/* Bekräfta lösenord */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                {t('auth.confirmPasswordLabel') || 'Bekräfta lösenord'}
              </label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
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

            {/* Registrera-knapp */}
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
              {loading ? t('common.loading') : t('auth.registerBtn')}
            </button>
          </form>

          {/* Länk tillbaka till Login */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#6B7280' }}>
            <span>{t('auth.hasAccount')} </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
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
              {t('auth.loginHere')}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}