import React from 'react';
import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation(); // Accéder à l'objet i18n pour changer la langue

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Changer la langue
  };

  return (
    <div>
      <button onClick={() => changeLanguage('en')} style={{ margin: '0 10px' }}>
        English
      </button>
      <button onClick={() => changeLanguage('fr')} style={{ margin: '0 10px' }}>
        Français
      </button>
    </div>
  );
}

export default LanguageSwitcher;
