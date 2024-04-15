import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  // Function to handle language change
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change the language using i18n
    localStorage.setItem('selectedLanguage', lng); // Save selected language to localStorage
  };

  // Effect to set the language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // Set language from localStorage
    }
  }, [i18n]);

  return (
    <div>
      <button onClick={() => changeLanguage('en')}>EN</button>
      <button onClick={() => changeLanguage('pt')}>PT</button>
    </div>
  );
}

export default LanguageSwitcher;
