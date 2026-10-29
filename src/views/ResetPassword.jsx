import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import logo from '../assets/logo.svg';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage(t('auth.passwordTooShort'));
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage(t('auth.passwordsDoNotMatch'));
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5001/api/auth/reset-password/${encodeURIComponent(resetToken)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        },
      );
      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        throw new Error(data.message || t('auth.resetPasswordFailed'));
      }

      setSuccess(true);
    } catch (error) {
      setErrorMessage(error.message || t('auth.resetPasswordFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

      <main style={{
        minHeight: '100vh',
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
        }}>
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <img
              src={logo}
              alt="SmartTvätt Logotyp"
              style={{ height: '75px', width: 'auto', display: 'block', margin: '0 auto 12px auto' }}
            />
            <h1 style={{ fontSize: '24px', margin: '0 0 4px 0' }}>{t('common.appName')}</h1>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#6B7280' }}>
              {t('common.tagline')}
            </p>
            <h2 style={{ fontSize: '18px', margin: '0 0 8px 0' }}>{t('auth.resetPasswordTitle')}</h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#6B7280' }}>
              {t('auth.resetPasswordDescription')}
            </p>
          </div>

          {errorMessage && (
            <div role="alert" style={{
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

          {success ? (
            <div>
              <p role="status" style={{ color: '#065F46', textAlign: 'center' }}>
                {t('auth.passwordResetSuccess')}
              </p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#1F6B56',
                  color: '#ffffff',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {t('auth.loginHere')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="new-password" style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                }}>
                  {t('auth.passwordLabel')}
                </label>
                <input
                  id="new-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    color: '#111827',
                    fontSize: '14px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="confirm-password" style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#6B7280',
                  textTransform: 'uppercase',
                }}>
                  {t('auth.confirmPasswordLabel')}
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: '#F9FAFB',
                    color: '#111827',
                    fontSize: '14px',
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: '#1F6B56',
                  color: '#ffffff',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? t('auth.resettingPassword') : t('auth.resetPasswordButton')}
              </button>
            </form>
          )}

          {!success && (
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                display: 'block',
                margin: '20px auto 0',
                background: 'none',
                border: 'none',
                color: '#1F6B56',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {t('auth.backToLogin')}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
