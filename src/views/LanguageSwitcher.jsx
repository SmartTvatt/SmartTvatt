import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Låt i18next uppdatera alla komponenter som använder översättningar.
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => changeLanguage('sv')}
        style={{
          background: i18n.language.startsWith('sv') ? '#1F6B56' : 'transparent',
          color: i18n.language.startsWith('sv') ? '#ffffff' : '#4B5563',
          border: '1px solid #D1D5DB',
          borderRadius: '6px',
          padding: '4px 8px',
          cursor: 'pointer',
          fontWeight: i18n.language.startsWith('sv') ? '600' : 'normal',
          fontSize: '12px'
        }}
      >
        SV
      </button>
      <button
        type="button"
        onClick={() => changeLanguage('en')}
        style={{
          background: i18n.language.startsWith('en') ? '#1F6B56' : 'transparent',
          color: i18n.language.startsWith('en') ? '#ffffff' : '#4B5563',
          border: '1px solid #D1D5DB',
          borderRadius: '6px',
          padding: '4px 8px',
          cursor: 'pointer',
          fontWeight: i18n.language.startsWith('en') ? '600' : 'normal',
          fontSize: '12px'
        }}
      >
        EN
      </button>
    </div>
  );
}