import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import staticBdEN from './locales/en/bd.json';
import staticBdPT from './locales/pt/bd.json';
import translationEN from './locales/en/translation.json';
import translationPT from './locales/pt/translation.json';

const savedLanguage = localStorage.getItem('selectedLanguage');

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        bd: staticBdEN,
        translation: translationEN,
      },
      pt: {
        bd: staticBdPT,
        translation: translationPT,
      },
    },
    lng: savedLanguage || 'pt',
    fallbackLng: 'pt',
    ns: ['translation', 'bd'],      
    defaultNS: 'translation',          
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
