import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.svg';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function ResetPassword() {
  const { t } = useTranslation();
  const { resetToken: token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage(t('auth.passwordsDoNotMatch') || 'Lösenorden matchar inte.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t('auth.passwordTooShort') || 'Lösenordet måste vara minst 6 tecken.');
      return;
    }

    setLoading(true);

    try {
      // PUT-anrop med token direkt i URL-sökvägen (:resetToken)
      const response = await fetch(`http://localhost:5001/api/auth/reset-password/${encodeURIComponent(token)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || t('auth.resetPasswordFailed') || 'Det gick inte att återställa lösenordet.');
      }

      setSuccessMessage(t('auth.resetSuccess') || 'Lösenordet har uppdaterats!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setErrorMessage(error.message || 'Det gick inte att ansluta eller uppdatera lösenordet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      {/* Språkväljare i övre högra hörnet */}
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      {/* Huvudcontainer */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}>
        {/* Kort */}
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
            <h1 style={{ fontSize: '24px', margin: '0 0 4px 0', color: '#111827' }}>
              {t('common.appName')}
            </h1>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6B7280' }}>
              {t('common.tagline')}
            </p>
            <h2 style={{ fontSize: '18px', margin: '0 0 8px 0', color: '#111827' }}>
              {t('auth.resetPasswordTitle') || 'Välj ett nytt lösenord'}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>
              {t('auth.resetPasswordDescription') || 'Ange och bekräfta ditt nya lösenord.'}
            </p>
          </div>

          {/* Fel- eller framgångsmeddelanden */}
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

          {successMessage && (
            <div style={{
              padding: '10px 14px',
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              borderRadius: '10px',
              fontSize: '13px',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                {t('auth.passwordLabel') || 'LÖSENORD'}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                {t('auth.confirmPasswordLabel') || 'BEKRÄFTA LÖSENORD'}
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? (t('auth.saving') || 'Sparar...') : (t('auth.savePassword') || 'Spara nytt lösenord')}
            </button>
          </form>

          {/* Länk tillbaka till inloggningen */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px' }}>
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
                textDecoration: 'underline',
              }}
            >
              {t('auth.backToLogin') || 'Tillbaka till inloggningen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}