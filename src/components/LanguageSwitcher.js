import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../style/LanguageSwitcher.css';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');

  // Function to handle language change
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change the language using i18n
    localStorage.setItem('selectedLanguage', lng); // Save selected language to localStorage
    setSelectedLanguage(lng); // Update state to reflect selected language
  };

  // Effect to set the language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // Set language from localStorage
    }
  }, [i18n]);

  return (
    <div className="translation-menu">
      <button
        className={`translation-item ${selectedLanguage === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      <button
        className={`translation-item ${selectedLanguage === 'pt' ? 'active' : ''}`}
        onClick={() => changeLanguage('pt')}
      >
        PT
      </button>
    </div>
  );
}

export default LanguageSwitcher;
