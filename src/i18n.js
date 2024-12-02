import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpApi) // Charge les fichiers de traduction
  .use(LanguageDetector) // Détecte la langue de l'utilisateur
  .use(initReactI18next) // Initialise avec React
  .init({
    supportedLngs: ['en', 'fr'], // Langues supportées
    fallbackLng: 'en', // Langue par défaut
    detection: {
      order: ['cookie', 'localStorage', 'navigator'], // Ordre de détection
      caches: ['cookie'], // Sauvegarde la langue
    },
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Chemin des fichiers de traduction
    },
    react: {
      useSuspense: false, // Désactive Suspense (optionnel)
    },
  });

export default i18n;
