import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.svg';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetPath, setResetPath] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setResetPath('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || t('auth.forgotPasswordFailed'));
      }
      if (typeof data.resetToken !== 'string' || !data.resetToken) {
        throw new Error(t('auth.resetLinkUnavailable'));
      }

      setResetPath(`/reset-password/${encodeURIComponent(data.resetToken)}`);
    } catch (error) {
      setErrorMessage(error.message || t('auth.forgotPasswordFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <div style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
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
          textAlign: 'left',
        }}>
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
              {t('auth.forgotPasswordTitle')}
            </h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#6B7280' }}>
              {t('auth.forgotPasswordDescription')}
            </p>
          </div>

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

          {resetPath ? (
            <div>
              <p style={{ color: '#1F6B56', textAlign: 'center', fontWeight: '600', marginBottom: '16px', fontSize: '14px' }}>
                {t('auth.resetLinkCreated')}
              </p>
              <button
                type="button"
                onClick={() => navigate(resetPath)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#1F6B56',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                }}
              >
                {t('auth.continueToReset')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>
                  {t('auth.emailLabel')}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
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
                {loading ? t('auth.sendingResetLink') : t('auth.sendResetLink')}
              </button>
            </form>
          )}

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
              {t('auth.backToLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}