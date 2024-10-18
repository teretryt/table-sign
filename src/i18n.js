import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json';
import translationTR from './locales/tr/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translationEN,
      },
      tr: {
        translation: translationTR,
      },
    },
    lng: 'tr', // varsayılan dil
    fallbackLng: 'tr',
    interpolation: {
      escapeValue: false, // React zaten XSS koruması sağlar
    },
  });

export default i18n;