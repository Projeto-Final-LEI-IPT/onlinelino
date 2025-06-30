import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../style/LanguageSwitcher.css';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'en');

  // Function to handle language change
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); 
    localStorage.setItem('selectedLanguage', lng); 
    setSelectedLanguage(lng); 
  };

  // Effect to set the language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); 
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
