// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

// Importar traducciones
import es from "../app/locales/es";
import en from "../app/locales/en";
import pt from "../app/locales/pt";

i18n
  .use(initReactI18next)
  .init({
    lng: Localization.locale.slice(0, 2), // Detecta idioma del dispositivo (es, en, pt, etc)
    fallbackLng: "es",
    resources: {
      es: { translation: es },
      en: { translation: en },
      pt: { translation: pt },
    },
    interpolation: {
      escapeValue: false, // React ya lo hace
    },
  });

export default i18n;
