import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

// Obter o idioma do localStorage, caso exista
const savedLanguage = localStorage.getItem('selectedLanguage');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      pt: {
        translation: translationPT,
      },
    },
    lng: savedLanguage || 'pt', // Se houver o idioma salvo no localStorage, usa ele, senão usa 'pt' como padrão
    fallbackLng: 'pt', // Idioma de fallback
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
