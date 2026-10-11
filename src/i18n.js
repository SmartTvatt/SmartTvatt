import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import svTranslation from './locales/sv.json';
import enTranslation from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      sv: { translation: svTranslation },
      en: { translation: enTranslation },
    },
    fallbackLng: 'sv', // Svenska som standardspråk
    debug: true, // Visar i18n-loggar i webbläsarens konsol så du ser om språket ändras
    interpolation: {
      escapeValue: false, // React sköter redan XSS-skydd
    },
  });

export default i18n;